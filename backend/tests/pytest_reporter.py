import json
import time
import os
import traceback
from typing import Any

import pytest
from fastapi.testclient import TestClient

class ReportManager:
    def __init__(self):
        self.test_reports = {}
        self.session_metrics = {
            "PASS": 0,
            "FAIL": 0,
            "SKIPPED": 0,
            "total_time_ms": 0,
            "total_requests": 0,
            "slowest_time": 0,
            "fastest_time": float('inf'),
            "slowest_endpoint": None,
            "fastest_endpoint": None,
        }

    def add_request(self, test_name: str, method: str, url: str, status_code: int, exec_time_ms: float, response_size: int, payload: Any, response_body: Any):
        if test_name not in self.test_reports:
            self.test_reports[test_name] = {
                "requests": [],
                "status": "UNKNOWN",
                "error": None,
                "traceback": None,
                "duration_s": 0.0,
            }
        self.test_reports[test_name]["requests"].append({
            "method": method,
            "endpoint": str(url),
            "status_code": status_code,
            "execution_time_ms": exec_time_ms,
            "response_size": response_size,
            "payload": payload,
            "response": response_body,
            "warning": exec_time_ms > 3000
        })
        
        self.session_metrics["total_time_ms"] += exec_time_ms
        self.session_metrics["total_requests"] += 1
        if exec_time_ms > self.session_metrics["slowest_time"]:
            self.session_metrics["slowest_time"] = exec_time_ms
            self.session_metrics["slowest_endpoint"] = f"{method} {url}"
        if exec_time_ms < self.session_metrics["fastest_time"]:
            self.session_metrics["fastest_time"] = exec_time_ms
            self.session_metrics["fastest_endpoint"] = f"{method} {url}"

    def update_test_status(self, test_name: str, status: str, duration: float, excinfo=None):
        if test_name not in self.test_reports:
            self.test_reports[test_name] = {
                "requests": [],
            }
        
        # Determine the final status of a test (if it fails at setup, call, or teardown)
        current_status = self.test_reports[test_name].get("status", "UNKNOWN")
        
        if current_status != "FAIL": # Keep FAIL if it failed earlier
            self.test_reports[test_name]["status"] = status
            
        self.test_reports[test_name]["duration_s"] = duration
        
        if excinfo:
            self.test_reports[test_name]["error"] = str(excinfo.value) if hasattr(excinfo, "value") else str(excinfo)
            if hasattr(excinfo, "tb"):
                self.test_reports[test_name]["traceback"] = "".join(traceback.format_exception(type(excinfo.value), excinfo.value, excinfo.tb))

    def generate_json(self, path="tests/report.json"):
        with open(path, "w", encoding="utf-8") as f:
            json.dump({
                "metrics": self.session_metrics,
                "tests": self.test_reports
            }, f, indent=2)

    def generate_md(self, path="tests/report.md"):
        avg_time = (self.session_metrics["total_time_ms"] / self.session_metrics["total_requests"]) if self.session_metrics["total_requests"] > 0 else 0
        
        lines = [
            "# SentinelX Automated Integration Test Report",
            "",
            "## Summary",
            f"- **PASS:** {self.session_metrics['PASS']}",
            f"- **FAIL:** {self.session_metrics['FAIL']}",
            f"- **SKIPPED:** {self.session_metrics['SKIPPED']}",
            f"- **Average Response Time:** {avg_time:.2f} ms",
            f"- **Slowest Endpoint:** {self.session_metrics['slowest_endpoint']} ({self.session_metrics['slowest_time']:.2f} ms)",
            f"- **Fastest Endpoint:** {self.session_metrics['fastest_endpoint']} ({self.session_metrics['fastest_time']:.2f} ms)",
            "",
            "## Details",
            ""
        ]

        for test_name, data in self.test_reports.items():
            status = data.get("status", "UNKNOWN")
            lines.append(f"### {test_name}")
            lines.append(f"**Status:** {status}")
            lines.append(f"**Test Duration:** {data.get('duration_s', 0):.2f}s")
            
            if data.get("error"):
                lines.append(f"**Error:** `{data['error']}`")
            if data.get("traceback"):
                lines.append("<details><summary>Traceback</summary>")
                lines.append("```python")
                lines.append(data["traceback"])
                lines.append("```")
                lines.append("</details>")

            if data.get("requests"):
                lines.append("#### API Requests")
                for i, req in enumerate(data["requests"], 1):
                    warning = " ⚠️ **WARNING: >3s**" if req["warning"] else ""
                    lines.append(f"- **{i}. {req['method']} {req['endpoint']}** {warning}")
                    lines.append(f"  - Status Code: {req['status_code']}")
                    lines.append(f"  - Execution Time: {req['execution_time_ms']:.2f} ms")
                    lines.append(f"  - Response Size: {req['response_size']} bytes")
                    
                    if req.get("payload"):
                        lines.append("  <details><summary>Payload</summary>")
                        lines.append("  ```json")
                        lines.append(f"  {json.dumps(req['payload'], indent=2)}")
                        lines.append("  ```")
                        lines.append("  </details>")
                        
                    if req.get("response"):
                        lines.append("  <details><summary>Response</summary>")
                        lines.append("  ```json")
                        try:
                            lines.append(f"  {json.dumps(req['response'], indent=2)}")
                        except Exception:
                            lines.append(f"  {str(req['response'])}")
                        lines.append("  ```")
                        lines.append("  </details>")
            lines.append("---")
            lines.append("")

        with open(path, "w", encoding="utf-8") as f:
            f.write("\n".join(lines))


report_manager = ReportManager()

def pytest_runtest_makereport(item, call):
    # This hook is called multiple times per test: setup, call, teardown.
    # We want to capture the final status of the test.
    test_name = item.nodeid
    
    if call.when == "call":
        status = "PASS"
        if call.excinfo:
            status = "FAIL"
            
        report_manager.update_test_status(test_name, status, call.duration, call.excinfo)
    elif call.when == "setup":
        if call.excinfo:
            if call.excinfo.errisinstance(pytest.skip.Exception):
                report_manager.update_test_status(test_name, "SKIPPED", call.duration)
            else:
                report_manager.update_test_status(test_name, "FAIL", call.duration, call.excinfo)

def pytest_sessionfinish(session, exitstatus):
    # Tally metrics
    for data in report_manager.test_reports.values():
        status = data.get("status")
        if status in report_manager.session_metrics:
            report_manager.session_metrics[status] += 1
            
    report_manager.generate_json()
    report_manager.generate_md()


class ReportingTestClient(TestClient):
    def request(self, method: str, url: str, **kwargs):
        test_name = os.environ.get("PYTEST_CURRENT_TEST", "Unknown").split(" ")[0]
        
        payload = kwargs.get("json") or kwargs.get("data")
        
        start_time = time.perf_counter()
        response = super().request(method, url, **kwargs)
        end_time = time.perf_counter()
        
        exec_time_ms = (end_time - start_time) * 1000
        response_size = len(response.content) if response.content else 0
        
        try:
            response_body = response.json()
        except Exception:
            response_body = response.text
            
        report_manager.add_request(
            test_name=test_name,
            method=method,
            url=str(response.request.url),
            status_code=response.status_code,
            exec_time_ms=exec_time_ms,
            response_size=response_size,
            payload=payload,
            response_body=response_body
        )
        
        return response
