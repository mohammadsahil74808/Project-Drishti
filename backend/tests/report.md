# SentinelX Automated Integration Test Report

## Summary
- **PASS:** 38
- **FAIL:** 0
- **SKIPPED:** 3
- **Average Response Time:** 180.48 ms
- **Slowest Endpoint:** POST http://testserver/api/v1/users/me/change-password (712.76 ms)
- **Fastest Endpoint:** GET http://testserver/api/v1/health/ai (2.23 ms)

## Details

### tests/test_alerts.py::test_alerts_crud
**Status:** PASS
**Test Duration:** 0.20s
#### API Requests
- **1. POST http://testserver/api/v1/auth/login** 
  - Status Code: 200
  - Execution Time: 432.59 ms
  - Response Size: 647 bytes
  <details><summary>Payload</summary>
  ```json
  {
  "badge_no": "ADMIN001",
  "password": "Admin@123"
}
  ```
  </details>
  <details><summary>Response</summary>
  ```json
  {
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmYTM3MGUxNS05YjE2LTQ3OTUtYTA3Ni1jYmY5OGYwZTJhY2UiLCJ0eXBlIjoiYWNjZXNzIiwiaWF0IjoxNzg0MDQzMDczLCJleHAiOjE3ODQwNDY2NzMsInJvbGUiOiJhZG1pbiJ9.vyRKN4hZIg35XziYSgHHPmfU1MiqDlr9ippai896YwM",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmYTM3MGUxNS05YjE2LTQ3OTUtYTA3Ni1jYmY5OGYwZTJhY2UiLCJ0eXBlIjoicmVmcmVzaCIsImlhdCI6MTc4NDA0MzA3MywiZXhwIjoxNzg0NjQ3ODczfQ.hD5J2XkVIxSls3T8dfWFH5TyHkNYpg3DmMNHs35p3mI",
  "token_type": "bearer",
  "user": {
    "id": "fa370e15-9b16-4795-a076-cbf98f0e2ace",
    "name": "System Admin",
    "badge_no": "ADMIN001",
    "role": "admin",
    "is_active": true,
    "station_id": null
  }
}
  ```
  </details>
- **2. GET http://testserver/api/v1/alerts** 
  - Status Code: 200
  - Execution Time: 154.10 ms
  - Response Size: 2092 bytes
  <details><summary>Response</summary>
  ```json
  [
  {
    "id": "ba1eb934-7a21-440c-ba74-5831f26f8da7",
    "type": "anomaly",
    "message": "System generated alert #2 for statewide monitoring.",
    "severity": "medium",
    "target_role": "admin",
    "station_id": null,
    "acknowledged": true,
    "created_at": "2026-07-14T13:43:54.730339+05:30"
  },
  {
    "id": "72d95a16-8b80-4a41-8dac-3d950743f7fa",
    "type": "new_hotspot",
    "message": "System generated alert #3 for statewide monitoring.",
    "severity": "critical",
    "target_role": null,
    "station_id": null,
    "acknowledged": true,
    "created_at": "2026-07-14T13:43:54.730339+05:30"
  },
  {
    "id": "e223e03a-3714-42d7-81a4-b5bf4e543b83",
    "type": "forecast_spike",
    "message": "System generated alert #8 for statewide monitoring.",
    "severity": "critical",
    "target_role": "admin",
    "station_id": null,
    "acknowledged": true,
    "created_at": "2026-07-14T13:43:54.730339+05:30"
  },
  {
    "id": "659d0b8b-1ca7-46fd-9bdf-f163fbc611f0",
    "type": "missing_person_match",
    "message": "System generated alert #10 for statewide monitoring.",
    "severity": "high",
    "target_role": "admin",
    "station_id": null,
    "acknowledged": true,
    "created_at": "2026-07-14T13:43:54.730339+05:30"
  },
  {
    "id": "53f36fe9-a808-4c6a-b3e2-e103d28da1b9",
    "type": "missing_person_match",
    "message": "System generated alert #14 for statewide monitoring.",
    "severity": "critical",
    "target_role": "admin",
    "station_id": null,
    "acknowledged": true,
    "created_at": "2026-07-14T13:43:54.730339+05:30"
  },
  {
    "id": "c9404e97-70f6-460f-814e-d6f2ae79a147",
    "type": "forecast_spike",
    "message": "System generated alert #20 for statewide monitoring.",
    "severity": "high",
    "target_role": null,
    "station_id": null,
    "acknowledged": true,
    "created_at": "2026-07-14T13:43:54.730339+05:30"
  },
  {
    "id": "da992e24-5f0a-4212-9a3e-7566bd45162e",
    "type": "new_hotspot",
    "message": "System generated alert #21 for statewide monitoring.",
    "severity": "low",
    "target_role": "admin",
    "station_id": null,
    "acknowledged": true,
    "created_at": "2026-07-14T13:43:54.730339+05:30"
  },
  {
    "id": "0a82f176-0d80-4894-9ab5-778c3c94b69d",
    "type": "new_hotspot",
    "message": "System generated alert #28 for statewide monitoring.",
    "severity": "medium",
    "target_role": "admin",
    "station_id": null,
    "acknowledged": false,
    "created_at": "2026-07-14T13:43:54.730339+05:30"
  }
]
  ```
  </details>
- **3. POST http://testserver/api/v1/alerts/ba1eb934-7a21-440c-ba74-5831f26f8da7/acknowledge** 
  - Status Code: 200
  - Execution Time: 28.01 ms
  - Response Size: 122 bytes
  <details><summary>Response</summary>
  ```json
  {
  "id": "ba1eb934-7a21-440c-ba74-5831f26f8da7",
  "acknowledged": true,
  "acknowledged_by": "fa370e15-9b16-4795-a076-cbf98f0e2ace"
}
  ```
  </details>
- **4. POST http://testserver/api/v1/alerts/ba1eb934-7a21-440c-ba74-5831f26f8da7/acknowledge** 
  - Status Code: 200
  - Execution Time: 19.75 ms
  - Response Size: 122 bytes
  <details><summary>Response</summary>
  ```json
  {
  "id": "ba1eb934-7a21-440c-ba74-5831f26f8da7",
  "acknowledged": true,
  "acknowledged_by": "fa370e15-9b16-4795-a076-cbf98f0e2ace"
}
  ```
  </details>
---

### tests/test_alerts.py::test_alerts_ack_nonexistent
**Status:** PASS
**Test Duration:** 0.01s
#### API Requests
- **1. POST http://testserver/api/v1/auth/login** 
  - Status Code: 200
  - Execution Time: 383.76 ms
  - Response Size: 647 bytes
  <details><summary>Payload</summary>
  ```json
  {
  "badge_no": "ADMIN001",
  "password": "Admin@123"
}
  ```
  </details>
  <details><summary>Response</summary>
  ```json
  {
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmYTM3MGUxNS05YjE2LTQ3OTUtYTA3Ni1jYmY5OGYwZTJhY2UiLCJ0eXBlIjoiYWNjZXNzIiwiaWF0IjoxNzg0MDQzMDc0LCJleHAiOjE3ODQwNDY2NzQsInJvbGUiOiJhZG1pbiJ9.MK5IuvgJ4XWWkrCmcl9aJR1dfPia0xUTjiW68h8gvcY",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmYTM3MGUxNS05YjE2LTQ3OTUtYTA3Ni1jYmY5OGYwZTJhY2UiLCJ0eXBlIjoicmVmcmVzaCIsImlhdCI6MTc4NDA0MzA3NCwiZXhwIjoxNzg0NjQ3ODc0fQ.OPavc2OaMwstUY4lCt64xGk0T9nypnvo0eWhtOccHPI",
  "token_type": "bearer",
  "user": {
    "id": "fa370e15-9b16-4795-a076-cbf98f0e2ace",
    "name": "System Admin",
    "badge_no": "ADMIN001",
    "role": "admin",
    "is_active": true,
    "station_id": null
  }
}
  ```
  </details>
- **2. POST http://testserver/api/v1/alerts/d8db92db-f539-4261-9906-3902ace75208/acknowledge** 
  - Status Code: 404
  - Execution Time: 10.12 ms
  - Response Size: 66 bytes
  <details><summary>Response</summary>
  ```json
  {
  "detail": "Alert d8db92db-f539-4261-9906-3902ace75208 not found."
}
  ```
  </details>
---

### tests/test_analytics.py::test_analytics_trend
**Status:** PASS
**Test Duration:** 0.01s
#### API Requests
- **1. POST http://testserver/api/v1/auth/login** 
  - Status Code: 200
  - Execution Time: 391.66 ms
  - Response Size: 647 bytes
  <details><summary>Payload</summary>
  ```json
  {
  "badge_no": "ADMIN001",
  "password": "Admin@123"
}
  ```
  </details>
  <details><summary>Response</summary>
  ```json
  {
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmYTM3MGUxNS05YjE2LTQ3OTUtYTA3Ni1jYmY5OGYwZTJhY2UiLCJ0eXBlIjoiYWNjZXNzIiwiaWF0IjoxNzg0MDQzMDc0LCJleHAiOjE3ODQwNDY2NzQsInJvbGUiOiJhZG1pbiJ9.MK5IuvgJ4XWWkrCmcl9aJR1dfPia0xUTjiW68h8gvcY",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmYTM3MGUxNS05YjE2LTQ3OTUtYTA3Ni1jYmY5OGYwZTJhY2UiLCJ0eXBlIjoicmVmcmVzaCIsImlhdCI6MTc4NDA0MzA3NCwiZXhwIjoxNzg0NjQ3ODc0fQ.OPavc2OaMwstUY4lCt64xGk0T9nypnvo0eWhtOccHPI",
  "token_type": "bearer",
  "user": {
    "id": "fa370e15-9b16-4795-a076-cbf98f0e2ace",
    "name": "System Admin",
    "badge_no": "ADMIN001",
    "role": "admin",
    "is_active": true,
    "station_id": null
  }
}
  ```
  </details>
- **2. GET http://testserver/api/v1/analytics/trend** 
  - Status Code: 200
  - Execution Time: 12.98 ms
  - Response Size: 5682 bytes
  <details><summary>Response</summary>
  ```json
  {
  "district_id": null,
  "crime_type": null,
  "granularity": "daily",
  "points": [
    {
      "period": "2025-07-12",
      "count": 2
    },
    {
      "period": "2025-07-17",
      "count": 1
    },
    {
      "period": "2025-07-18",
      "count": 1
    },
    {
      "period": "2025-07-22",
      "count": 1
    },
    {
      "period": "2025-07-25",
      "count": 1
    },
    {
      "period": "2025-08-03",
      "count": 1
    },
    {
      "period": "2025-08-07",
      "count": 1
    },
    {
      "period": "2025-08-08",
      "count": 1
    },
    {
      "period": "2025-08-09",
      "count": 1
    },
    {
      "period": "2025-08-12",
      "count": 1
    },
    {
      "period": "2025-08-17",
      "count": 4
    },
    {
      "period": "2025-08-18",
      "count": 1
    },
    {
      "period": "2025-08-21",
      "count": 1
    },
    {
      "period": "2025-08-22",
      "count": 1
    },
    {
      "period": "2025-08-24",
      "count": 1
    },
    {
      "period": "2025-08-26",
      "count": 1
    },
    {
      "period": "2025-08-29",
      "count": 1
    },
    {
      "period": "2025-08-31",
      "count": 1
    },
    {
      "period": "2025-09-01",
      "count": 1
    },
    {
      "period": "2025-09-03",
      "count": 1
    },
    {
      "period": "2025-09-05",
      "count": 1
    },
    {
      "period": "2025-09-06",
      "count": 1
    },
    {
      "period": "2025-09-10",
      "count": 1
    },
    {
      "period": "2025-09-11",
      "count": 2
    },
    {
      "period": "2025-09-14",
      "count": 1
    },
    {
      "period": "2025-09-17",
      "count": 1
    },
    {
      "period": "2025-09-18",
      "count": 1
    },
    {
      "period": "2025-09-20",
      "count": 1
    },
    {
      "period": "2025-09-21",
      "count": 1
    },
    {
      "period": "2025-09-23",
      "count": 1
    },
    {
      "period": "2025-09-24",
      "count": 1
    },
    {
      "period": "2025-09-27",
      "count": 1
    },
    {
      "period": "2025-09-28",
      "count": 1
    },
    {
      "period": "2025-09-30",
      "count": 1
    },
    {
      "period": "2025-10-04",
      "count": 2
    },
    {
      "period": "2025-10-06",
      "count": 1
    },
    {
      "period": "2025-10-08",
      "count": 1
    },
    {
      "period": "2025-10-09",
      "count": 1
    },
    {
      "period": "2025-10-10",
      "count": 1
    },
    {
      "period": "2025-10-12",
      "count": 1
    },
    {
      "period": "2025-10-15",
      "count": 1
    },
    {
      "period": "2025-10-17",
      "count": 1
    },
    {
      "period": "2025-10-18",
      "count": 2
    },
    {
      "period": "2025-10-20",
      "count": 2
    },
    {
      "period": "2025-10-21",
      "count": 1
    },
    {
      "period": "2025-10-22",
      "count": 1
    },
    {
      "period": "2025-10-23",
      "count": 2
    },
    {
      "period": "2025-10-26",
      "count": 1
    },
    {
      "period": "2025-10-28",
      "count": 2
    },
    {
      "period": "2025-10-29",
      "count": 1
    },
    {
      "period": "2025-10-30",
      "count": 1
    },
    {
      "period": "2025-11-02",
      "count": 1
    },
    {
      "period": "2025-11-04",
      "count": 1
    },
    {
      "period": "2025-11-05",
      "count": 1
    },
    {
      "period": "2025-11-08",
      "count": 1
    },
    {
      "period": "2025-11-10",
      "count": 2
    },
    {
      "period": "2025-11-14",
      "count": 1
    },
    {
      "period": "2025-11-15",
      "count": 2
    },
    {
      "period": "2025-11-18",
      "count": 1
    },
    {
      "period": "2025-11-19",
      "count": 1
    },
    {
      "period": "2025-11-21",
      "count": 1
    },
    {
      "period": "2025-11-23",
      "count": 2
    },
    {
      "period": "2025-11-27",
      "count": 1
    },
    {
      "period": "2025-11-28",
      "count": 1
    },
    {
      "period": "2025-12-02",
      "count": 1
    },
    {
      "period": "2025-12-03",
      "count": 1
    },
    {
      "period": "2025-12-04",
      "count": 1
    },
    {
      "period": "2025-12-06",
      "count": 4
    },
    {
      "period": "2025-12-08",
      "count": 1
    },
    {
      "period": "2025-12-13",
      "count": 1
    },
    {
      "period": "2025-12-14",
      "count": 3
    },
    {
      "period": "2025-12-16",
      "count": 1
    },
    {
      "period": "2025-12-22",
      "count": 1
    },
    {
      "period": "2025-12-26",
      "count": 1
    },
    {
      "period": "2025-12-28",
      "count": 3
    },
    {
      "period": "2025-12-29",
      "count": 1
    },
    {
      "period": "2025-12-31",
      "count": 1
    },
    {
      "period": "2026-01-01",
      "count": 2
    },
    {
      "period": "2026-01-04",
      "count": 1
    },
    {
      "period": "2026-01-05",
      "count": 1
    },
    {
      "period": "2026-01-06",
      "count": 2
    },
    {
      "period": "2026-01-08",
      "count": 1
    },
    {
      "period": "2026-01-09",
      "count": 1
    },
    {
      "period": "2026-01-10",
      "count": 1
    },
    {
      "period": "2026-01-12",
      "count": 2
    },
    {
      "period": "2026-01-13",
      "count": 1
    },
    {
      "period": "2026-01-15",
      "count": 1
    },
    {
      "period": "2026-01-16",
      "count": 1
    },
    {
      "period": "2026-01-21",
      "count": 1
    },
    {
      "period": "2026-01-22",
      "count": 2
    },
    {
      "period": "2026-01-25",
      "count": 1
    },
    {
      "period": "2026-01-27",
      "count": 1
    },
    {
      "period": "2026-01-28",
      "count": 1
    },
    {
      "period": "2026-02-03",
      "count": 1
    },
    {
      "period": "2026-02-04",
      "count": 1
    },
    {
      "period": "2026-02-07",
      "count": 1
    },
    {
      "period": "2026-02-10",
      "count": 1
    },
    {
      "period": "2026-02-11",
      "count": 1
    },
    {
      "period": "2026-02-12",
      "count": 2
    },
    {
      "period": "2026-02-13",
      "count": 2
    },
    {
      "period": "2026-02-17",
      "count": 1
    },
    {
      "period": "2026-02-18",
      "count": 1
    },
    {
      "period": "2026-02-19",
      "count": 1
    },
    {
      "period": "2026-02-20",
      "count": 1
    },
    {
      "period": "2026-02-22",
      "count": 1
    },
    {
      "period": "2026-02-23",
      "count": 1
    },
    {
      "period": "2026-02-25",
      "count": 1
    },
    {
      "period": "2026-02-26",
      "count": 1
    },
    {
      "period": "2026-02-28",
      "count": 2
    },
    {
      "period": "2026-03-01",
      "count": 1
    },
    {
      "period": "2026-03-03",
      "count": 1
    },
    {
      "period": "2026-03-07",
      "count": 1
    },
    {
      "period": "2026-03-09",
      "count": 1
    },
    {
      "period": "2026-03-10",
      "count": 1
    },
    {
      "period": "2026-03-12",
      "count": 1
    },
    {
      "period": "2026-03-15",
      "count": 1
    },
    {
      "period": "2026-03-16",
      "count": 1
    },
    {
      "period": "2026-03-21",
      "count": 1
    },
    {
      "period": "2026-03-22",
      "count": 1
    },
    {
      "period": "2026-03-26",
      "count": 2
    },
    {
      "period": "2026-03-27",
      "count": 1
    },
    {
      "period": "2026-03-28",
      "count": 1
    },
    {
      "period": "2026-03-30",
      "count": 1
    },
    {
      "period": "2026-04-02",
      "count": 1
    },
    {
      "period": "2026-04-05",
      "count": 1
    },
    {
      "period": "2026-04-06",
      "count": 1
    },
    {
      "period": "2026-04-08",
      "count": 1
    },
    {
      "period": "2026-04-15",
      "count": 2
    },
    {
      "period": "2026-04-16",
      "count": 1
    },
    {
      "period": "2026-04-18",
      "count": 1
    },
    {
      "period": "2026-04-19",
      "count": 1
    },
    {
      "period": "2026-04-26",
      "count": 1
    },
    {
      "period": "2026-04-28",
      "count": 1
    },
    {
      "period": "2026-05-02",
      "count": 1
    },
    {
      "period": "2026-05-03",
      "count": 1
    },
    {
      "period": "2026-05-04",
      "count": 3
    },
    {
      "period": "2026-05-08",
      "count": 1
    },
    {
      "period": "2026-05-10",
      "count": 1
    },
    {
      "period": "2026-05-16",
      "count": 1
    },
    {
      "period": "2026-05-18",
      "count": 1
    },
    {
      "period": "2026-05-23",
      "count": 1
    },
    {
      "period": "2026-05-24",
      "count": 1
    },
    {
      "period": "2026-05-25",
      "count": 2
    },
    {
      "period": "2026-05-29",
      "count": 1
    },
    {
      "period": "2026-05-31",
      "count": 1
    },
    {
      "period": "2026-06-02",
      "count": 2
    },
    {
      "period": "2026-06-03",
      "count": 1
    },
    {
      "period": "2026-06-07",
      "count": 2
    },
    {
      "period": "2026-06-08",
      "count": 1
    },
    {
      "period": "2026-06-09",
      "count": 1
    },
    {
      "period": "2026-06-13",
      "count": 1
    },
    {
      "period": "2026-06-14",
      "count": 1
    },
    {
      "period": "2026-06-15",
      "count": 1
    },
    {
      "period": "2026-06-16",
      "count": 1
    },
    {
      "period": "2026-06-17",
      "count": 1
    },
    {
      "period": "2026-06-20",
      "count": 2
    },
    {
      "period": "2026-06-23",
      "count": 1
    },
    {
      "period": "2026-06-25",
      "count": 1
    },
    {
      "period": "2026-06-29",
      "count": 1
    },
    {
      "period": "2026-07-02",
      "count": 1
    },
    {
      "period": "2026-07-06",
      "count": 1
    },
    {
      "period": "2026-07-10",
      "count": 1
    },
    {
      "period": "2026-07-11",
      "count": 2
    },
    {
      "period": "2026-07-12",
      "count": 1
    },
    {
      "period": "2026-07-14",
      "count": 27
    }
  ]
}
  ```
  </details>
---

### tests/test_analytics.py::test_analytics_distribution
**Status:** PASS
**Test Duration:** 0.01s
#### API Requests
- **1. POST http://testserver/api/v1/auth/login** 
  - Status Code: 200
  - Execution Time: 421.33 ms
  - Response Size: 647 bytes
  <details><summary>Payload</summary>
  ```json
  {
  "badge_no": "ADMIN001",
  "password": "Admin@123"
}
  ```
  </details>
  <details><summary>Response</summary>
  ```json
  {
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmYTM3MGUxNS05YjE2LTQ3OTUtYTA3Ni1jYmY5OGYwZTJhY2UiLCJ0eXBlIjoiYWNjZXNzIiwiaWF0IjoxNzg0MDQzMDc1LCJleHAiOjE3ODQwNDY2NzUsInJvbGUiOiJhZG1pbiJ9.xXLgwTxNxa2NjevCzRQkP5CRrHIOLBwQ6TlTxMponXc",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmYTM3MGUxNS05YjE2LTQ3OTUtYTA3Ni1jYmY5OGYwZTJhY2UiLCJ0eXBlIjoicmVmcmVzaCIsImlhdCI6MTc4NDA0MzA3NSwiZXhwIjoxNzg0NjQ3ODc1fQ.GuoQ4xWSno-wPFRCgzUYAXuyCLEeeYqoU3Q695Lpz_U",
  "token_type": "bearer",
  "user": {
    "id": "fa370e15-9b16-4795-a076-cbf98f0e2ace",
    "name": "System Admin",
    "badge_no": "ADMIN001",
    "role": "admin",
    "is_active": true,
    "station_id": null
  }
}
  ```
  </details>
- **2. GET http://testserver/api/v1/analytics/distribution** 
  - Status Code: 200
  - Execution Time: 9.13 ms
  - Response Size: 368 bytes
  <details><summary>Response</summary>
  ```json
  {
  "total": 227,
  "items": [
    {
      "crime_type": "theft",
      "count": 47
    },
    {
      "crime_type": "robbery",
      "count": 29
    },
    {
      "crime_type": "chain_snatching",
      "count": 28
    },
    {
      "crime_type": "assault",
      "count": 26
    },
    {
      "crime_type": "missing_person",
      "count": 25
    },
    {
      "crime_type": "cybercrime",
      "count": 23
    },
    {
      "crime_type": "burglary",
      "count": 18
    },
    {
      "crime_type": "other",
      "count": 16
    },
    {
      "crime_type": "vehicle_theft",
      "count": 15
    }
  ]
}
  ```
  </details>
---

### tests/test_analytics.py::test_analytics_day_of_week
**Status:** PASS
**Test Duration:** 0.01s
#### API Requests
- **1. POST http://testserver/api/v1/auth/login** 
  - Status Code: 200
  - Execution Time: 417.67 ms
  - Response Size: 647 bytes
  <details><summary>Payload</summary>
  ```json
  {
  "badge_no": "ADMIN001",
  "password": "Admin@123"
}
  ```
  </details>
  <details><summary>Response</summary>
  ```json
  {
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmYTM3MGUxNS05YjE2LTQ3OTUtYTA3Ni1jYmY5OGYwZTJhY2UiLCJ0eXBlIjoiYWNjZXNzIiwiaWF0IjoxNzg0MDQzMDc1LCJleHAiOjE3ODQwNDY2NzUsInJvbGUiOiJhZG1pbiJ9.xXLgwTxNxa2NjevCzRQkP5CRrHIOLBwQ6TlTxMponXc",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmYTM3MGUxNS05YjE2LTQ3OTUtYTA3Ni1jYmY5OGYwZTJhY2UiLCJ0eXBlIjoicmVmcmVzaCIsImlhdCI6MTc4NDA0MzA3NSwiZXhwIjoxNzg0NjQ3ODc1fQ.GuoQ4xWSno-wPFRCgzUYAXuyCLEeeYqoU3Q695Lpz_U",
  "token_type": "bearer",
  "user": {
    "id": "fa370e15-9b16-4795-a076-cbf98f0e2ace",
    "name": "System Admin",
    "badge_no": "ADMIN001",
    "role": "admin",
    "is_active": true,
    "station_id": null
  }
}
  ```
  </details>
- **2. GET http://testserver/api/v1/analytics/day-of-week** 
  - Status Code: 200
  - Execution Time: 8.51 ms
  - Response Size: 176 bytes
  <details><summary>Response</summary>
  ```json
  [
  {
    "day": "Sun",
    "count": 38
  },
  {
    "day": "Mon",
    "count": 28
  },
  {
    "day": "Tue",
    "count": 54
  },
  {
    "day": "Wed",
    "count": 23
  },
  {
    "day": "Thu",
    "count": 29
  },
  {
    "day": "Fri",
    "count": 21
  },
  {
    "day": "Sat",
    "count": 34
  }
]
  ```
  </details>
---

### tests/test_analytics.py::test_analytics_insight
**Status:** PASS
**Test Duration:** 0.01s
#### API Requests
- **1. POST http://testserver/api/v1/auth/login** 
  - Status Code: 200
  - Execution Time: 389.20 ms
  - Response Size: 647 bytes
  <details><summary>Payload</summary>
  ```json
  {
  "badge_no": "ADMIN001",
  "password": "Admin@123"
}
  ```
  </details>
  <details><summary>Response</summary>
  ```json
  {
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmYTM3MGUxNS05YjE2LTQ3OTUtYTA3Ni1jYmY5OGYwZTJhY2UiLCJ0eXBlIjoiYWNjZXNzIiwiaWF0IjoxNzg0MDQzMDc2LCJleHAiOjE3ODQwNDY2NzYsInJvbGUiOiJhZG1pbiJ9.h7Daof1VCIeDK4WuBCcI2GnWP9Arxh8Pu2VdPDzT8GU",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmYTM3MGUxNS05YjE2LTQ3OTUtYTA3Ni1jYmY5OGYwZTJhY2UiLCJ0eXBlIjoicmVmcmVzaCIsImlhdCI6MTc4NDA0MzA3NiwiZXhwIjoxNzg0NjQ3ODc2fQ.NfYgMRgC9aCuhEa8iu9hCMHDyITVN3Y4RrRvZmpG6es",
  "token_type": "bearer",
  "user": {
    "id": "fa370e15-9b16-4795-a076-cbf98f0e2ace",
    "name": "System Admin",
    "badge_no": "ADMIN001",
    "role": "admin",
    "is_active": true,
    "station_id": null
  }
}
  ```
  </details>
- **2. GET http://testserver/api/v1/analytics/insight** 
  - Status Code: 200
  - Execution Time: 12.43 ms
  - Response Size: 178 bytes
  <details><summary>Response</summary>
  ```json
  {
  "summary": "Theft is the leading crime type in this view (47 cases, 21% of total). Overall volume trend for the period looks rising.",
  "generated_at": "2026-07-14T15:31:16.035138"
}
  ```
  </details>
---

### tests/test_analytics.py::test_analytics_classify
**Status:** SKIPPED
**Test Duration:** 0.40s
#### API Requests
- **1. POST http://testserver/api/v1/auth/login** 
  - Status Code: 200
  - Execution Time: 389.64 ms
  - Response Size: 647 bytes
  <details><summary>Payload</summary>
  ```json
  {
  "badge_no": "ADMIN001",
  "password": "Admin@123"
}
  ```
  </details>
  <details><summary>Response</summary>
  ```json
  {
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmYTM3MGUxNS05YjE2LTQ3OTUtYTA3Ni1jYmY5OGYwZTJhY2UiLCJ0eXBlIjoiYWNjZXNzIiwiaWF0IjoxNzg0MDQzMDc2LCJleHAiOjE3ODQwNDY2NzYsInJvbGUiOiJhZG1pbiJ9.h7Daof1VCIeDK4WuBCcI2GnWP9Arxh8Pu2VdPDzT8GU",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmYTM3MGUxNS05YjE2LTQ3OTUtYTA3Ni1jYmY5OGYwZTJhY2UiLCJ0eXBlIjoicmVmcmVzaCIsImlhdCI6MTc4NDA0MzA3NiwiZXhwIjoxNzg0NjQ3ODc2fQ.NfYgMRgC9aCuhEa8iu9hCMHDyITVN3Y4RrRvZmpG6es",
  "token_type": "bearer",
  "user": {
    "id": "fa370e15-9b16-4795-a076-cbf98f0e2ace",
    "name": "System Admin",
    "badge_no": "ADMIN001",
    "role": "admin",
    "is_active": true,
    "station_id": null
  }
}
  ```
  </details>
- **2. GET http://testserver/api/v1/health/ai** 
  - Status Code: 404
  - Execution Time: 3.81 ms
  - Response Size: 22 bytes
  <details><summary>Response</summary>
  ```json
  {
  "detail": "Not Found"
}
  ```
  </details>
---

### tests/test_analytics.py::test_analytics_classify_invalid_payload
**Status:** SKIPPED
**Test Duration:** 0.42s
#### API Requests
- **1. POST http://testserver/api/v1/auth/login** 
  - Status Code: 200
  - Execution Time: 407.08 ms
  - Response Size: 647 bytes
  <details><summary>Payload</summary>
  ```json
  {
  "badge_no": "ADMIN001",
  "password": "Admin@123"
}
  ```
  </details>
  <details><summary>Response</summary>
  ```json
  {
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmYTM3MGUxNS05YjE2LTQ3OTUtYTA3Ni1jYmY5OGYwZTJhY2UiLCJ0eXBlIjoiYWNjZXNzIiwiaWF0IjoxNzg0MDQzMDc2LCJleHAiOjE3ODQwNDY2NzYsInJvbGUiOiJhZG1pbiJ9.h7Daof1VCIeDK4WuBCcI2GnWP9Arxh8Pu2VdPDzT8GU",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmYTM3MGUxNS05YjE2LTQ3OTUtYTA3Ni1jYmY5OGYwZTJhY2UiLCJ0eXBlIjoicmVmcmVzaCIsImlhdCI6MTc4NDA0MzA3NiwiZXhwIjoxNzg0NjQ3ODc2fQ.NfYgMRgC9aCuhEa8iu9hCMHDyITVN3Y4RrRvZmpG6es",
  "token_type": "bearer",
  "user": {
    "id": "fa370e15-9b16-4795-a076-cbf98f0e2ace",
    "name": "System Admin",
    "badge_no": "ADMIN001",
    "role": "admin",
    "is_active": true,
    "station_id": null
  }
}
  ```
  </details>
- **2. GET http://testserver/api/v1/health/ai** 
  - Status Code: 404
  - Execution Time: 2.39 ms
  - Response Size: 22 bytes
  <details><summary>Response</summary>
  ```json
  {
  "detail": "Not Found"
}
  ```
  </details>
---

### tests/test_assistant.py::test_assistant_chat
**Status:** PASS
**Test Duration:** 0.01s
#### API Requests
- **1. POST http://testserver/api/v1/auth/login** 
  - Status Code: 200
  - Execution Time: 433.35 ms
  - Response Size: 647 bytes
  <details><summary>Payload</summary>
  ```json
  {
  "badge_no": "ADMIN001",
  "password": "Admin@123"
}
  ```
  </details>
  <details><summary>Response</summary>
  ```json
  {
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmYTM3MGUxNS05YjE2LTQ3OTUtYTA3Ni1jYmY5OGYwZTJhY2UiLCJ0eXBlIjoiYWNjZXNzIiwiaWF0IjoxNzg0MDQzMDc3LCJleHAiOjE3ODQwNDY2NzcsInJvbGUiOiJhZG1pbiJ9.Q1l_A-gb1-88rnNc4PodYBAhRoaE--yiuWjBUXbF9fI",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmYTM3MGUxNS05YjE2LTQ3OTUtYTA3Ni1jYmY5OGYwZTJhY2UiLCJ0eXBlIjoicmVmcmVzaCIsImlhdCI6MTc4NDA0MzA3NywiZXhwIjoxNzg0NjQ3ODc3fQ.25jMSJN2cC775QceysdhD12lWYWcGyEu4XyzLl8Zt14",
  "token_type": "bearer",
  "user": {
    "id": "fa370e15-9b16-4795-a076-cbf98f0e2ace",
    "name": "System Admin",
    "badge_no": "ADMIN001",
    "role": "admin",
    "is_active": true,
    "station_id": null
  }
}
  ```
  </details>
- **2. GET http://testserver/api/v1/health/ai** 
  - Status Code: 404
  - Execution Time: 3.10 ms
  - Response Size: 22 bytes
  <details><summary>Response</summary>
  ```json
  {
  "detail": "Not Found"
}
  ```
  </details>
- **3. POST http://testserver/api/v1/assistant/chat** 
  - Status Code: 200
  - Execution Time: 6.23 ms
  - Response Size: 45 bytes
  <details><summary>Payload</summary>
  ```json
  {
  "query": "What is the crime trend this month?",
  "context_mode": "general"
}
  ```
  </details>
  <details><summary>Response</summary>
  ```json
  {
  "message": "AI Assistant is not configured."
}
  ```
  </details>
---

### tests/test_assistant.py::test_assistant_chat_invalid_payload
**Status:** PASS
**Test Duration:** 0.00s
#### API Requests
- **1. POST http://testserver/api/v1/auth/login** 
  - Status Code: 200
  - Execution Time: 491.77 ms
  - Response Size: 647 bytes
  <details><summary>Payload</summary>
  ```json
  {
  "badge_no": "ADMIN001",
  "password": "Admin@123"
}
  ```
  </details>
  <details><summary>Response</summary>
  ```json
  {
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmYTM3MGUxNS05YjE2LTQ3OTUtYTA3Ni1jYmY5OGYwZTJhY2UiLCJ0eXBlIjoiYWNjZXNzIiwiaWF0IjoxNzg0MDQzMDc3LCJleHAiOjE3ODQwNDY2NzcsInJvbGUiOiJhZG1pbiJ9.Q1l_A-gb1-88rnNc4PodYBAhRoaE--yiuWjBUXbF9fI",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmYTM3MGUxNS05YjE2LTQ3OTUtYTA3Ni1jYmY5OGYwZTJhY2UiLCJ0eXBlIjoicmVmcmVzaCIsImlhdCI6MTc4NDA0MzA3NywiZXhwIjoxNzg0NjQ3ODc3fQ.25jMSJN2cC775QceysdhD12lWYWcGyEu4XyzLl8Zt14",
  "token_type": "bearer",
  "user": {
    "id": "fa370e15-9b16-4795-a076-cbf98f0e2ace",
    "name": "System Admin",
    "badge_no": "ADMIN001",
    "role": "admin",
    "is_active": true,
    "station_id": null
  }
}
  ```
  </details>
- **2. POST http://testserver/api/v1/assistant/chat** 
  - Status Code: 422
  - Execution Time: 4.04 ms
  - Response Size: 112 bytes
  <details><summary>Payload</summary>
  ```json
  {
  "context_mode": "general"
}
  ```
  </details>
  <details><summary>Response</summary>
  ```json
  {
  "detail": [
    {
      "type": "missing",
      "loc": [
        "body",
        "query"
      ],
      "msg": "Field required",
      "input": {
        "context_mode": "general"
      }
    }
  ]
}
  ```
  </details>
---

### tests/test_auth.py::test_login_success
**Status:** PASS
**Test Duration:** 0.38s
#### API Requests
- **1. POST http://testserver/api/v1/auth/login** 
  - Status Code: 200
  - Execution Time: 383.03 ms
  - Response Size: 647 bytes
  <details><summary>Payload</summary>
  ```json
  {
  "badge_no": "ADMIN001",
  "password": "Admin@123"
}
  ```
  </details>
  <details><summary>Response</summary>
  ```json
  {
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmYTM3MGUxNS05YjE2LTQ3OTUtYTA3Ni1jYmY5OGYwZTJhY2UiLCJ0eXBlIjoiYWNjZXNzIiwiaWF0IjoxNzg0MDQzMDc4LCJleHAiOjE3ODQwNDY2NzgsInJvbGUiOiJhZG1pbiJ9.o-nzwPPgNUPixfCa3gzXxqK7s1Xq2VHfnJDAm0ZFHxc",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmYTM3MGUxNS05YjE2LTQ3OTUtYTA3Ni1jYmY5OGYwZTJhY2UiLCJ0eXBlIjoicmVmcmVzaCIsImlhdCI6MTc4NDA0MzA3OCwiZXhwIjoxNzg0NjQ3ODc4fQ.pIke1eY-z3vhdxmi_xVe4iwG-pya_LJfKDHfoRXL8M8",
  "token_type": "bearer",
  "user": {
    "id": "fa370e15-9b16-4795-a076-cbf98f0e2ace",
    "name": "System Admin",
    "badge_no": "ADMIN001",
    "role": "admin",
    "is_active": true,
    "station_id": null
  }
}
  ```
  </details>
---

### tests/test_auth.py::test_login_invalid_credentials
**Status:** PASS
**Test Duration:** 0.01s
#### API Requests
- **1. POST http://testserver/api/v1/auth/login** 
  - Status Code: 401
  - Execution Time: 10.19 ms
  - Response Size: 46 bytes
  <details><summary>Payload</summary>
  ```json
  {
  "badge_no": "INVALID",
  "password": "WrongPassword"
}
  ```
  </details>
  <details><summary>Response</summary>
  ```json
  {
  "detail": "Invalid badge number or password."
}
  ```
  </details>
---

### tests/test_auth.py::test_refresh_token
**Status:** PASS
**Test Duration:** 0.44s
#### API Requests
- **1. POST http://testserver/api/v1/auth/login** 
  - Status Code: 200
  - Execution Time: 490.99 ms
  - Response Size: 647 bytes
  <details><summary>Payload</summary>
  ```json
  {
  "badge_no": "ADMIN001",
  "password": "Admin@123"
}
  ```
  </details>
  <details><summary>Response</summary>
  ```json
  {
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmYTM3MGUxNS05YjE2LTQ3OTUtYTA3Ni1jYmY5OGYwZTJhY2UiLCJ0eXBlIjoiYWNjZXNzIiwiaWF0IjoxNzg0MDQzMDc4LCJleHAiOjE3ODQwNDY2NzgsInJvbGUiOiJhZG1pbiJ9.o-nzwPPgNUPixfCa3gzXxqK7s1Xq2VHfnJDAm0ZFHxc",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmYTM3MGUxNS05YjE2LTQ3OTUtYTA3Ni1jYmY5OGYwZTJhY2UiLCJ0eXBlIjoicmVmcmVzaCIsImlhdCI6MTc4NDA0MzA3OCwiZXhwIjoxNzg0NjQ3ODc4fQ.pIke1eY-z3vhdxmi_xVe4iwG-pya_LJfKDHfoRXL8M8",
  "token_type": "bearer",
  "user": {
    "id": "fa370e15-9b16-4795-a076-cbf98f0e2ace",
    "name": "System Admin",
    "badge_no": "ADMIN001",
    "role": "admin",
    "is_active": true,
    "station_id": null
  }
}
  ```
  </details>
- **2. POST http://testserver/api/v1/auth/login** 
  - Status Code: 200
  - Execution Time: 433.48 ms
  - Response Size: 647 bytes
  <details><summary>Payload</summary>
  ```json
  {
  "badge_no": "ADMIN001",
  "password": "Admin@123"
}
  ```
  </details>
  <details><summary>Response</summary>
  ```json
  {
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmYTM3MGUxNS05YjE2LTQ3OTUtYTA3Ni1jYmY5OGYwZTJhY2UiLCJ0eXBlIjoiYWNjZXNzIiwiaWF0IjoxNzg0MDQzMDc5LCJleHAiOjE3ODQwNDY2NzksInJvbGUiOiJhZG1pbiJ9.DpkmaxRA_-XRBngrFs_mqc8PAE9Y8bTpz0m56Ije1EU",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmYTM3MGUxNS05YjE2LTQ3OTUtYTA3Ni1jYmY5OGYwZTJhY2UiLCJ0eXBlIjoicmVmcmVzaCIsImlhdCI6MTc4NDA0MzA3OSwiZXhwIjoxNzg0NjQ3ODc5fQ.c9edxmRuSX_sjww-ZVvXVvwwWBKrjUhDiXvGqLHxxaM",
  "token_type": "bearer",
  "user": {
    "id": "fa370e15-9b16-4795-a076-cbf98f0e2ace",
    "name": "System Admin",
    "badge_no": "ADMIN001",
    "role": "admin",
    "is_active": true,
    "station_id": null
  }
}
  ```
  </details>
- **3. POST http://testserver/api/v1/auth/refresh** 
  - Status Code: 200
  - Execution Time: 7.91 ms
  - Response Size: 500 bytes
  <details><summary>Payload</summary>
  ```json
  {
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmYTM3MGUxNS05YjE2LTQ3OTUtYTA3Ni1jYmY5OGYwZTJhY2UiLCJ0eXBlIjoicmVmcmVzaCIsImlhdCI6MTc4NDA0MzA3OSwiZXhwIjoxNzg0NjQ3ODc5fQ.c9edxmRuSX_sjww-ZVvXVvwwWBKrjUhDiXvGqLHxxaM"
}
  ```
  </details>
  <details><summary>Response</summary>
  ```json
  {
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmYTM3MGUxNS05YjE2LTQ3OTUtYTA3Ni1jYmY5OGYwZTJhY2UiLCJ0eXBlIjoiYWNjZXNzIiwiaWF0IjoxNzg0MDQzMDc5LCJleHAiOjE3ODQwNDY2NzksInJvbGUiOiJhZG1pbiJ9.DpkmaxRA_-XRBngrFs_mqc8PAE9Y8bTpz0m56Ije1EU",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmYTM3MGUxNS05YjE2LTQ3OTUtYTA3Ni1jYmY5OGYwZTJhY2UiLCJ0eXBlIjoicmVmcmVzaCIsImlhdCI6MTc4NDA0MzA3OSwiZXhwIjoxNzg0NjQ3ODc5fQ.c9edxmRuSX_sjww-ZVvXVvwwWBKrjUhDiXvGqLHxxaM",
  "token_type": "bearer"
}
  ```
  </details>
---

### tests/test_auth.py::test_refresh_token_invalid
**Status:** PASS
**Test Duration:** 0.01s
#### API Requests
- **1. POST http://testserver/api/v1/auth/refresh** 
  - Status Code: 401
  - Execution Time: 7.51 ms
  - Response Size: 129 bytes
  <details><summary>Payload</summary>
  ```json
  {
  "refresh_token": "invalid.jwt.token"
}
  ```
  </details>
  <details><summary>Response</summary>
  ```json
  {
  "detail": "Invalid refresh token: Invalid header string: 'utf-8' codec can't decode byte 0x8a in position 0: invalid start byte"
}
  ```
  </details>
---

### tests/test_auth.py::test_get_me
**Status:** PASS
**Test Duration:** 0.01s
#### API Requests
- **1. POST http://testserver/api/v1/auth/login** 
  - Status Code: 200
  - Execution Time: 374.50 ms
  - Response Size: 647 bytes
  <details><summary>Payload</summary>
  ```json
  {
  "badge_no": "ADMIN001",
  "password": "Admin@123"
}
  ```
  </details>
  <details><summary>Response</summary>
  ```json
  {
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmYTM3MGUxNS05YjE2LTQ3OTUtYTA3Ni1jYmY5OGYwZTJhY2UiLCJ0eXBlIjoiYWNjZXNzIiwiaWF0IjoxNzg0MDQzMDc5LCJleHAiOjE3ODQwNDY2NzksInJvbGUiOiJhZG1pbiJ9.DpkmaxRA_-XRBngrFs_mqc8PAE9Y8bTpz0m56Ije1EU",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmYTM3MGUxNS05YjE2LTQ3OTUtYTA3Ni1jYmY5OGYwZTJhY2UiLCJ0eXBlIjoicmVmcmVzaCIsImlhdCI6MTc4NDA0MzA3OSwiZXhwIjoxNzg0NjQ3ODc5fQ.c9edxmRuSX_sjww-ZVvXVvwwWBKrjUhDiXvGqLHxxaM",
  "token_type": "bearer",
  "user": {
    "id": "fa370e15-9b16-4795-a076-cbf98f0e2ace",
    "name": "System Admin",
    "badge_no": "ADMIN001",
    "role": "admin",
    "is_active": true,
    "station_id": null
  }
}
  ```
  </details>
- **2. GET http://testserver/api/v1/auth/me** 
  - Status Code: 200
  - Execution Time: 7.98 ms
  - Response Size: 139 bytes
  <details><summary>Response</summary>
  ```json
  {
  "id": "fa370e15-9b16-4795-a076-cbf98f0e2ace",
  "name": "System Admin",
  "badge_no": "ADMIN001",
  "role": "admin",
  "is_active": true,
  "station_id": null
}
  ```
  </details>
---

### tests/test_auth.py::test_get_me_unauthorized
**Status:** PASS
**Test Duration:** 0.01s
#### API Requests
- **1. GET http://testserver/api/v1/auth/me** 
  - Status Code: 401
  - Execution Time: 7.89 ms
  - Response Size: 30 bytes
  <details><summary>Response</summary>
  ```json
  {
  "detail": "Not authenticated"
}
  ```
  </details>
---

### tests/test_auth.py::test_get_me_invalid_jwt
**Status:** PASS
**Test Duration:** 0.01s
#### API Requests
- **1. GET http://testserver/api/v1/auth/me** 
  - Status Code: 401
  - Execution Time: 9.03 ms
  - Response Size: 132 bytes
  <details><summary>Response</summary>
  ```json
  {
  "detail": "Invalid or expired token: Invalid header string: 'utf-8' codec can't decode byte 0x8a in position 0: invalid start byte"
}
  ```
  </details>
---

### tests/test_dashboard.py::test_dashboard_summary
**Status:** PASS
**Test Duration:** 0.07s
#### API Requests
- **1. POST http://testserver/api/v1/auth/login** 
  - Status Code: 200
  - Execution Time: 462.56 ms
  - Response Size: 647 bytes
  <details><summary>Payload</summary>
  ```json
  {
  "badge_no": "ADMIN001",
  "password": "Admin@123"
}
  ```
  </details>
  <details><summary>Response</summary>
  ```json
  {
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmYTM3MGUxNS05YjE2LTQ3OTUtYTA3Ni1jYmY5OGYwZTJhY2UiLCJ0eXBlIjoiYWNjZXNzIiwiaWF0IjoxNzg0MDQzMDgwLCJleHAiOjE3ODQwNDY2ODAsInJvbGUiOiJhZG1pbiJ9.SjJc9yNkERNpaY9bI7gL-p7RCEsaKLugyx41ubKHtYs",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmYTM3MGUxNS05YjE2LTQ3OTUtYTA3Ni1jYmY5OGYwZTJhY2UiLCJ0eXBlIjoicmVmcmVzaCIsImlhdCI6MTc4NDA0MzA4MCwiZXhwIjoxNzg0NjQ3ODgwfQ.O8kajQpjlEbiGV1JyelQR00Z7-n511K6ekDm8ixDt2g",
  "token_type": "bearer",
  "user": {
    "id": "fa370e15-9b16-4795-a076-cbf98f0e2ace",
    "name": "System Admin",
    "badge_no": "ADMIN001",
    "role": "admin",
    "is_active": true,
    "station_id": null
  }
}
  ```
  </details>
- **2. GET http://testserver/api/v1/dashboard/summary** 
  - Status Code: 200
  - Execution Time: 65.48 ms
  - Response Size: 3737 bytes
  <details><summary>Response</summary>
  ```json
  {
  "stats": [
    {
      "label": "Total FIRs",
      "value": "227",
      "delta": "",
      "trend": "up"
    },
    {
      "label": "Active Hotspots",
      "value": "25",
      "delta": "",
      "trend": "up"
    },
    {
      "label": "Missing Persons (open)",
      "value": "49",
      "delta": "",
      "trend": "down"
    }
  ],
  "district_risk": [
    {
      "district_id": "e0328f8b-68a2-45c6-9e8e-195cb16c0b36",
      "district_name": "Bengaluru Rural",
      "score": 87,
      "severity": "critical"
    },
    {
      "district_id": "84e906c4-9615-4beb-a611-3b2d4977e53b",
      "district_name": "Udupi",
      "score": 87,
      "severity": "critical"
    },
    {
      "district_id": "920cfca7-4717-4546-95ad-5f295be019bf",
      "district_name": "Bengaluru Urban",
      "score": 82,
      "severity": "critical"
    },
    {
      "district_id": "78fde344-43b4-4191-8aa6-53d893e72fa7",
      "district_name": "Kalaburagi",
      "score": 82,
      "severity": "critical"
    },
    {
      "district_id": "01036fbe-c25c-4336-9014-edb51277c675",
      "district_name": "Bagalkot",
      "score": 82,
      "severity": "critical"
    },
    {
      "district_id": "0e671165-ad57-427e-aa48-0b35eddad590",
      "district_name": "Gadag",
      "score": 80,
      "severity": "critical"
    },
    {
      "district_id": "ecdc21bd-d555-4248-90a5-b451655d207b",
      "district_name": "Koppal",
      "score": 78,
      "severity": "critical"
    },
    {
      "district_id": "9dafcebe-47f5-4da7-a2e2-eb6bd69f6f50",
      "district_name": "Bidar",
      "score": 77,
      "severity": "critical"
    },
    {
      "district_id": "e7257647-bbf9-4610-a0e2-48fc9a59db40",
      "district_name": "Vijayapura",
      "score": 76,
      "severity": "critical"
    },
    {
      "district_id": "3826cad2-e3e6-4823-bb63-e6c6431704e9",
      "district_name": "Uttara Kannada",
      "score": 71,
      "severity": "high"
    },
    {
      "district_id": "57a16457-3924-47fe-93ff-3d712f898179",
      "district_name": "Tumakuru",
      "score": 70,
      "severity": "high"
    },
    {
      "district_id": "b7d572b4-bc49-4422-87aa-53b216f50e39",
      "district_name": "Mysuru",
      "score": 58,
      "severity": "high"
    },
    {
      "district_id": "a3401b0c-0d9d-48dd-a7de-58e1822e7b34",
      "district_name": "Shivamogga",
      "score": 55,
      "severity": "high"
    },
    {
      "district_id": "b6913b52-bfb3-4c89-b143-c7cf74c5bacf",
      "district_name": "Ballari",
      "score": 55,
      "severity": "high"
    },
    {
      "district_id": "9b5e4c14-9847-43da-a6c4-2cc44ae73b9e",
      "district_name": "Mandya",
      "score": 55,
      "severity": "high"
    },
    {
      "district_id": "a1d9ee79-0a83-4392-9f9c-07e5d1015c48",
      "district_name": "Davanagere",
      "score": 53,
      "severity": "high"
    },
    {
      "district_id": "72437c0e-f8fd-4ca2-9e27-0784343cb8ac",
      "district_name": "Chikkamagaluru",
      "score": 47,
      "severity": "medium"
    },
    {
      "district_id": "d246ed3c-4c5a-401e-bfd0-f31fb2682a91",
      "district_name": "Kolar",
      "score": 36,
      "severity": "medium"
    },
    {
      "district_id": "ef61a4f4-2fd5-4116-bea5-7fc2838d4b2c",
      "district_name": "Dakshina Kannada",
      "score": 35,
      "severity": "medium"
    },
    {
      "district_id": "c7a32d16-de14-4c26-ba25-3fb497ea39a3",
      "district_name": "Haveri",
      "score": 34,
      "severity": "medium"
    },
    {
      "district_id": "c1484fd7-7f7a-476e-ba4a-2684448d7fbc",
      "district_name": "Belagavi",
      "score": 29,
      "severity": "low"
    },
    {
      "district_id": "bd9f6476-f661-43d0-bdf1-d34d12c3d04a",
      "district_name": "Yadgir",
      "score": 29,
      "severity": "low"
    },
    {
      "district_id": "e4846dc4-b95b-4f6d-9614-7b2974bed954",
      "district_name": "Dharwad",
      "score": 21,
      "severity": "low"
    },
    {
      "district_id": "2f82a9d4-18bd-4b2a-9c0f-a92099b66e98",
      "district_name": "Chikkaballapur",
      "score": 20,
      "severity": "low"
    },
    {
      "district_id": "2ddc1089-65bc-43fe-b684-e734f366223f",
      "district_name": "Kodagu",
      "score": 18,
      "severity": "low"
    },
    {
      "district_id": "c7af75ff-044e-4af7-a251-e3bd6fbe8a03",
      "district_name": "Raichur",
      "score": 17,
      "severity": "low"
    },
    {
      "district_id": "9eb49de7-8983-4d1a-9987-22d4e438f6df",
      "district_name": "Chitradurga",
      "score": 15,
      "severity": "low"
    },
    {
      "district_id": "4ded930b-2721-4ce8-bded-af87807b7816",
      "district_name": "Chamarajanagar",
      "score": 14,
      "severity": "low"
    },
    {
      "district_id": "c556cace-805b-469b-a10f-3277c189c111",
      "district_name": "Hassan",
      "score": 13,
      "severity": "low"
    },
    {
      "district_id": "53f17eb6-04d9-4785-bd23-6e93bacd7052",
      "district_name": "Ramanagara",
      "score": 11,
      "severity": "low"
    },
    {
      "district_id": "2aa29b7b-7a16-494d-ab20-6ac4b046d38e",
      "district_name": "Test District",
      "score": 0,
      "severity": "low"
    }
  ]
}
  ```
  </details>
---

### tests/test_fir.py::test_fir_crud
**Status:** PASS
**Test Duration:** 0.14s
#### API Requests
- **1. POST http://testserver/api/v1/auth/login** 
  - Status Code: 200
  - Execution Time: 396.23 ms
  - Response Size: 647 bytes
  <details><summary>Payload</summary>
  ```json
  {
  "badge_no": "ADMIN001",
  "password": "Admin@123"
}
  ```
  </details>
  <details><summary>Response</summary>
  ```json
  {
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmYTM3MGUxNS05YjE2LTQ3OTUtYTA3Ni1jYmY5OGYwZTJhY2UiLCJ0eXBlIjoiYWNjZXNzIiwiaWF0IjoxNzg0MDQzMDgwLCJleHAiOjE3ODQwNDY2ODAsInJvbGUiOiJhZG1pbiJ9.SjJc9yNkERNpaY9bI7gL-p7RCEsaKLugyx41ubKHtYs",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmYTM3MGUxNS05YjE2LTQ3OTUtYTA3Ni1jYmY5OGYwZTJhY2UiLCJ0eXBlIjoicmVmcmVzaCIsImlhdCI6MTc4NDA0MzA4MCwiZXhwIjoxNzg0NjQ3ODgwfQ.O8kajQpjlEbiGV1JyelQR00Z7-n511K6ekDm8ixDt2g",
  "token_type": "bearer",
  "user": {
    "id": "fa370e15-9b16-4795-a076-cbf98f0e2ace",
    "name": "System Admin",
    "badge_no": "ADMIN001",
    "role": "admin",
    "is_active": true,
    "station_id": null
  }
}
  ```
  </details>
- **2. GET http://testserver/api/v1/geo/districts** 
  - Status Code: 200
  - Execution Time: 9.93 ms
  - Response Size: 2981 bytes
  <details><summary>Response</summary>
  ```json
  [
  {
    "id": "01036fbe-c25c-4336-9014-edb51277c675",
    "name": "Bagalkot",
    "state": null,
    "population": null
  },
  {
    "id": "b6913b52-bfb3-4c89-b143-c7cf74c5bacf",
    "name": "Ballari",
    "state": null,
    "population": null
  },
  {
    "id": "c1484fd7-7f7a-476e-ba4a-2684448d7fbc",
    "name": "Belagavi",
    "state": null,
    "population": null
  },
  {
    "id": "e0328f8b-68a2-45c6-9e8e-195cb16c0b36",
    "name": "Bengaluru Rural",
    "state": null,
    "population": null
  },
  {
    "id": "920cfca7-4717-4546-95ad-5f295be019bf",
    "name": "Bengaluru Urban",
    "state": null,
    "population": null
  },
  {
    "id": "9dafcebe-47f5-4da7-a2e2-eb6bd69f6f50",
    "name": "Bidar",
    "state": null,
    "population": null
  },
  {
    "id": "4ded930b-2721-4ce8-bded-af87807b7816",
    "name": "Chamarajanagar",
    "state": null,
    "population": null
  },
  {
    "id": "2f82a9d4-18bd-4b2a-9c0f-a92099b66e98",
    "name": "Chikkaballapur",
    "state": null,
    "population": null
  },
  {
    "id": "72437c0e-f8fd-4ca2-9e27-0784343cb8ac",
    "name": "Chikkamagaluru",
    "state": null,
    "population": null
  },
  {
    "id": "9eb49de7-8983-4d1a-9987-22d4e438f6df",
    "name": "Chitradurga",
    "state": null,
    "population": null
  },
  {
    "id": "ef61a4f4-2fd5-4116-bea5-7fc2838d4b2c",
    "name": "Dakshina Kannada",
    "state": null,
    "population": null
  },
  {
    "id": "a1d9ee79-0a83-4392-9f9c-07e5d1015c48",
    "name": "Davanagere",
    "state": null,
    "population": null
  },
  {
    "id": "e4846dc4-b95b-4f6d-9614-7b2974bed954",
    "name": "Dharwad",
    "state": null,
    "population": null
  },
  {
    "id": "0e671165-ad57-427e-aa48-0b35eddad590",
    "name": "Gadag",
    "state": null,
    "population": null
  },
  {
    "id": "c556cace-805b-469b-a10f-3277c189c111",
    "name": "Hassan",
    "state": null,
    "population": null
  },
  {
    "id": "c7a32d16-de14-4c26-ba25-3fb497ea39a3",
    "name": "Haveri",
    "state": null,
    "population": null
  },
  {
    "id": "78fde344-43b4-4191-8aa6-53d893e72fa7",
    "name": "Kalaburagi",
    "state": null,
    "population": null
  },
  {
    "id": "2ddc1089-65bc-43fe-b684-e734f366223f",
    "name": "Kodagu",
    "state": null,
    "population": null
  },
  {
    "id": "d246ed3c-4c5a-401e-bfd0-f31fb2682a91",
    "name": "Kolar",
    "state": null,
    "population": null
  },
  {
    "id": "ecdc21bd-d555-4248-90a5-b451655d207b",
    "name": "Koppal",
    "state": null,
    "population": null
  },
  {
    "id": "9b5e4c14-9847-43da-a6c4-2cc44ae73b9e",
    "name": "Mandya",
    "state": null,
    "population": null
  },
  {
    "id": "b7d572b4-bc49-4422-87aa-53b216f50e39",
    "name": "Mysuru",
    "state": null,
    "population": null
  },
  {
    "id": "c7af75ff-044e-4af7-a251-e3bd6fbe8a03",
    "name": "Raichur",
    "state": null,
    "population": null
  },
  {
    "id": "53f17eb6-04d9-4785-bd23-6e93bacd7052",
    "name": "Ramanagara",
    "state": null,
    "population": null
  },
  {
    "id": "a3401b0c-0d9d-48dd-a7de-58e1822e7b34",
    "name": "Shivamogga",
    "state": null,
    "population": null
  },
  {
    "id": "2aa29b7b-7a16-494d-ab20-6ac4b046d38e",
    "name": "Test District",
    "state": null,
    "population": null
  },
  {
    "id": "57a16457-3924-47fe-93ff-3d712f898179",
    "name": "Tumakuru",
    "state": null,
    "population": null
  },
  {
    "id": "84e906c4-9615-4beb-a611-3b2d4977e53b",
    "name": "Udupi",
    "state": null,
    "population": null
  },
  {
    "id": "3826cad2-e3e6-4823-bb63-e6c6431704e9",
    "name": "Uttara Kannada",
    "state": null,
    "population": null
  },
  {
    "id": "e7257647-bbf9-4610-a0e2-48fc9a59db40",
    "name": "Vijayapura",
    "state": null,
    "population": null
  },
  {
    "id": "bd9f6476-f661-43d0-bdf1-d34d12c3d04a",
    "name": "Yadgir",
    "state": null,
    "population": null
  }
]
  ```
  </details>
- **3. GET http://testserver/api/v1/geo/districts** 
  - Status Code: 200
  - Execution Time: 6.66 ms
  - Response Size: 2981 bytes
  <details><summary>Response</summary>
  ```json
  [
  {
    "id": "01036fbe-c25c-4336-9014-edb51277c675",
    "name": "Bagalkot",
    "state": null,
    "population": null
  },
  {
    "id": "b6913b52-bfb3-4c89-b143-c7cf74c5bacf",
    "name": "Ballari",
    "state": null,
    "population": null
  },
  {
    "id": "c1484fd7-7f7a-476e-ba4a-2684448d7fbc",
    "name": "Belagavi",
    "state": null,
    "population": null
  },
  {
    "id": "e0328f8b-68a2-45c6-9e8e-195cb16c0b36",
    "name": "Bengaluru Rural",
    "state": null,
    "population": null
  },
  {
    "id": "920cfca7-4717-4546-95ad-5f295be019bf",
    "name": "Bengaluru Urban",
    "state": null,
    "population": null
  },
  {
    "id": "9dafcebe-47f5-4da7-a2e2-eb6bd69f6f50",
    "name": "Bidar",
    "state": null,
    "population": null
  },
  {
    "id": "4ded930b-2721-4ce8-bded-af87807b7816",
    "name": "Chamarajanagar",
    "state": null,
    "population": null
  },
  {
    "id": "2f82a9d4-18bd-4b2a-9c0f-a92099b66e98",
    "name": "Chikkaballapur",
    "state": null,
    "population": null
  },
  {
    "id": "72437c0e-f8fd-4ca2-9e27-0784343cb8ac",
    "name": "Chikkamagaluru",
    "state": null,
    "population": null
  },
  {
    "id": "9eb49de7-8983-4d1a-9987-22d4e438f6df",
    "name": "Chitradurga",
    "state": null,
    "population": null
  },
  {
    "id": "ef61a4f4-2fd5-4116-bea5-7fc2838d4b2c",
    "name": "Dakshina Kannada",
    "state": null,
    "population": null
  },
  {
    "id": "a1d9ee79-0a83-4392-9f9c-07e5d1015c48",
    "name": "Davanagere",
    "state": null,
    "population": null
  },
  {
    "id": "e4846dc4-b95b-4f6d-9614-7b2974bed954",
    "name": "Dharwad",
    "state": null,
    "population": null
  },
  {
    "id": "0e671165-ad57-427e-aa48-0b35eddad590",
    "name": "Gadag",
    "state": null,
    "population": null
  },
  {
    "id": "c556cace-805b-469b-a10f-3277c189c111",
    "name": "Hassan",
    "state": null,
    "population": null
  },
  {
    "id": "c7a32d16-de14-4c26-ba25-3fb497ea39a3",
    "name": "Haveri",
    "state": null,
    "population": null
  },
  {
    "id": "78fde344-43b4-4191-8aa6-53d893e72fa7",
    "name": "Kalaburagi",
    "state": null,
    "population": null
  },
  {
    "id": "2ddc1089-65bc-43fe-b684-e734f366223f",
    "name": "Kodagu",
    "state": null,
    "population": null
  },
  {
    "id": "d246ed3c-4c5a-401e-bfd0-f31fb2682a91",
    "name": "Kolar",
    "state": null,
    "population": null
  },
  {
    "id": "ecdc21bd-d555-4248-90a5-b451655d207b",
    "name": "Koppal",
    "state": null,
    "population": null
  },
  {
    "id": "9b5e4c14-9847-43da-a6c4-2cc44ae73b9e",
    "name": "Mandya",
    "state": null,
    "population": null
  },
  {
    "id": "b7d572b4-bc49-4422-87aa-53b216f50e39",
    "name": "Mysuru",
    "state": null,
    "population": null
  },
  {
    "id": "c7af75ff-044e-4af7-a251-e3bd6fbe8a03",
    "name": "Raichur",
    "state": null,
    "population": null
  },
  {
    "id": "53f17eb6-04d9-4785-bd23-6e93bacd7052",
    "name": "Ramanagara",
    "state": null,
    "population": null
  },
  {
    "id": "a3401b0c-0d9d-48dd-a7de-58e1822e7b34",
    "name": "Shivamogga",
    "state": null,
    "population": null
  },
  {
    "id": "2aa29b7b-7a16-494d-ab20-6ac4b046d38e",
    "name": "Test District",
    "state": null,
    "population": null
  },
  {
    "id": "57a16457-3924-47fe-93ff-3d712f898179",
    "name": "Tumakuru",
    "state": null,
    "population": null
  },
  {
    "id": "84e906c4-9615-4beb-a611-3b2d4977e53b",
    "name": "Udupi",
    "state": null,
    "population": null
  },
  {
    "id": "3826cad2-e3e6-4823-bb63-e6c6431704e9",
    "name": "Uttara Kannada",
    "state": null,
    "population": null
  },
  {
    "id": "e7257647-bbf9-4610-a0e2-48fc9a59db40",
    "name": "Vijayapura",
    "state": null,
    "population": null
  },
  {
    "id": "bd9f6476-f661-43d0-bdf1-d34d12c3d04a",
    "name": "Yadgir",
    "state": null,
    "population": null
  }
]
  ```
  </details>
- **4. POST http://testserver/api/v1/fir** 
  - Status Code: 201
  - Execution Time: 38.11 ms
  - Response Size: 525 bytes
  <details><summary>Payload</summary>
  ```json
  {
  "fir_no": "KA-2026-09CFC6",
  "station_id": "28a62998-b184-4ead-be42-85ffb52a3134",
  "district_id": "01036fbe-c25c-4336-9014-edb51277c675",
  "crime_type": "theft",
  "ipc_sections": [
    "379"
  ],
  "incident_datetime": "2026-07-14T15:31:20.666963+00:00",
  "reported_datetime": "2026-07-14T15:31:20.666963+00:00",
  "location": {
    "lat": 12.9716,
    "lng": 77.5946
  },
  "address_text": "Integration Test Address",
  "mo_description": "Test MO"
}
  ```
  </details>
  <details><summary>Response</summary>
  ```json
  {
  "id": "85dfc886-db69-413e-b6dc-b9740d3fc985",
  "fir_no": "KA-2026-09CFC6",
  "station_id": "28a62998-b184-4ead-be42-85ffb52a3134",
  "district_id": "01036fbe-c25c-4336-9014-edb51277c675",
  "crime_type": "theft",
  "ipc_sections": [
    "379"
  ],
  "incident_datetime": "2026-07-14T21:01:20.666963+05:30",
  "reported_datetime": "2026-07-14T21:01:20.666963+05:30",
  "address_text": "Integration Test Address",
  "mo_description": "Test MO",
  "status": "open",
  "victim_age_bucket": null,
  "accused_count": 0,
  "weapon_used": null,
  "created_at": "2026-07-14T21:01:20.248767+05:30"
}
  ```
  </details>
- **5. GET http://testserver/api/v1/fir** 
  - Status Code: 200
  - Execution Time: 33.09 ms
  - Response Size: 12854 bytes
  <details><summary>Response</summary>
  ```json
  {
  "items": [
    {
      "id": "85dfc886-db69-413e-b6dc-b9740d3fc985",
      "fir_no": "KA-2026-09CFC6",
      "station_id": "28a62998-b184-4ead-be42-85ffb52a3134",
      "district_id": "01036fbe-c25c-4336-9014-edb51277c675",
      "crime_type": "theft",
      "ipc_sections": [
        "379"
      ],
      "incident_datetime": "2026-07-14T21:01:20.666963+05:30",
      "reported_datetime": "2026-07-14T21:01:20.666963+05:30",
      "address_text": "Integration Test Address",
      "mo_description": "Test MO",
      "status": "open",
      "victim_age_bucket": null,
      "accused_count": 0,
      "weapon_used": null,
      "created_at": "2026-07-14T21:01:20.248767+05:30"
    },
    {
      "id": "4908a724-8475-412d-a10d-d118835e598f",
      "fir_no": "KA-2026-255C29",
      "station_id": "28a62998-b184-4ead-be42-85ffb52a3134",
      "district_id": "01036fbe-c25c-4336-9014-edb51277c675",
      "crime_type": "theft",
      "ipc_sections": [],
      "incident_datetime": "2026-07-14T20:58:54.989207+05:30",
      "reported_datetime": "2026-07-14T20:58:54.989207+05:30",
      "address_text": null,
      "mo_description": null,
      "status": "open",
      "victim_age_bucket": null,
      "accused_count": 0,
      "weapon_used": null,
      "created_at": "2026-07-14T20:58:54.544513+05:30"
    },
    {
      "id": "cebfb521-1422-4698-9a70-17b462a2d010",
      "fir_no": "KA-2026-996A63",
      "station_id": "28a62998-b184-4ead-be42-85ffb52a3134",
      "district_id": "01036fbe-c25c-4336-9014-edb51277c675",
      "crime_type": "theft",
      "ipc_sections": [
        "379"
      ],
      "incident_datetime": "2026-07-14T20:58:54.396200+05:30",
      "reported_datetime": "2026-07-14T20:58:54.396200+05:30",
      "address_text": "Integration Test Address",
      "mo_description": "Test MO",
      "status": "closed",
      "victim_age_bucket": null,
      "accused_count": 0,
      "weapon_used": null,
      "created_at": "2026-07-14T20:58:53.905905+05:30"
    },
    {
      "id": "378a71f9-89a9-4ada-b07d-ab091312602c",
      "fir_no": "KA-2026-22C254",
      "station_id": "28a62998-b184-4ead-be42-85ffb52a3134",
      "district_id": "01036fbe-c25c-4336-9014-edb51277c675",
      "crime_type": "theft",
      "ipc_sections": [],
      "incident_datetime": "2026-07-14T20:56:11.500578+05:30",
      "reported_datetime": "2026-07-14T20:56:11.500578+05:30",
      "address_text": null,
      "mo_description": null,
      "status": "open",
      "victim_age_bucket": null,
      "accused_count": 0,
      "weapon_used": null,
      "created_at": "2026-07-14T20:56:10.817722+05:30"
    },
    {
      "id": "151845fd-3c9b-49fe-aab8-e5b1b8f8fb1c",
      "fir_no": "KA-2026-4F391D",
      "station_id": "28a62998-b184-4ead-be42-85ffb52a3134",
      "district_id": "01036fbe-c25c-4336-9014-edb51277c675",
      "crime_type": "theft",
      "ipc_sections": [
        "379"
      ],
      "incident_datetime": "2026-07-14T20:56:10.610445+05:30",
      "reported_datetime": "2026-07-14T20:56:10.610445+05:30",
      "address_text": "Integration Test Address",
      "mo_description": "Test MO",
      "status": "closed",
      "victim_age_bucket": null,
      "accused_count": 0,
      "weapon_used": null,
      "created_at": "2026-07-14T20:56:10.037157+05:30"
    },
    {
      "id": "f8a3cde2-90e5-4d00-906c-3ccfba882da7",
      "fir_no": "KA-2026-A608FE",
      "station_id": "28a62998-b184-4ead-be42-85ffb52a3134",
      "district_id": "01036fbe-c25c-4336-9014-edb51277c675",
      "crime_type": "theft",
      "ipc_sections": [],
      "incident_datetime": "2026-07-14T20:49:16.194794+05:30",
      "reported_datetime": "2026-07-14T20:49:16.194794+05:30",
      "address_text": null,
      "mo_description": null,
      "status": "open",
      "victim_age_bucket": null,
      "accused_count": 0,
      "weapon_used": null,
      "created_at": "2026-07-14T20:49:15.640786+05:30"
    },
    {
      "id": "c153f51c-b074-48fc-a79b-1d85221e2e53",
      "fir_no": "KA-2026-445C7F",
      "station_id": "28a62998-b184-4ead-be42-85ffb52a3134",
      "district_id": "01036fbe-c25c-4336-9014-edb51277c675",
      "crime_type": "theft",
      "ipc_sections": [
        "379"
      ],
      "incident_datetime": "2026-07-14T20:49:15.243259+05:30",
      "reported_datetime": "2026-07-14T20:49:15.243259+05:30",
      "address_text": "Integration Test Address",
      "mo_description": "Test MO",
      "status": "closed",
      "victim_age_bucket": null,
      "accused_count": 0,
      "weapon_used": null,
      "created_at": "2026-07-14T20:49:14.693675+05:30"
    },
    {
      "id": "95066287-8463-40f1-bc5e-3ef6ec106862",
      "fir_no": "KA-2026-57B983",
      "station_id": "28a62998-b184-4ead-be42-85ffb52a3134",
      "district_id": "01036fbe-c25c-4336-9014-edb51277c675",
      "crime_type": "theft",
      "ipc_sections": [],
      "incident_datetime": "2026-07-14T20:48:12.892870+05:30",
      "reported_datetime": "2026-07-14T20:48:12.892870+05:30",
      "address_text": null,
      "mo_description": null,
      "status": "open",
      "victim_age_bucket": null,
      "accused_count": 0,
      "weapon_used": null,
      "created_at": "2026-07-14T20:48:12.349745+05:30"
    },
    {
      "id": "e485b0b8-c385-40ae-9e89-00836a7455c4",
      "fir_no": "KA-2026-22DAF1",
      "station_id": "28a62998-b184-4ead-be42-85ffb52a3134",
      "district_id": "01036fbe-c25c-4336-9014-edb51277c675",
      "crime_type": "theft",
      "ipc_sections": [
        "379"
      ],
      "incident_datetime": "2026-07-14T20:48:11.562038+05:30",
      "reported_datetime": "2026-07-14T20:48:11.562038+05:30",
      "address_text": "Integration Test Address",
      "mo_description": "Test MO",
      "status": "closed",
      "victim_age_bucket": null,
      "accused_count": 0,
      "weapon_used": null,
      "created_at": "2026-07-14T20:48:10.960556+05:30"
    },
    {
      "id": "96b5d865-50fa-4f1a-9e46-82e4da8f0513",
      "fir_no": "KA-2026-D62B34",
      "station_id": "28a62998-b184-4ead-be42-85ffb52a3134",
      "district_id": "01036fbe-c25c-4336-9014-edb51277c675",
      "crime_type": "theft",
      "ipc_sections": [],
      "incident_datetime": "2026-07-14T20:42:42.740996+05:30",
      "reported_datetime": "2026-07-14T20:42:42.740996+05:30",
      "address_text": null,
      "mo_description": null,
      "status": "open",
      "victim_age_bucket": null,
      "accused_count": 0,
      "weapon_used": null,
      "created_at": "2026-07-14T20:42:42.292872+05:30"
    },
    {
      "id": "33b6aa40-c2a9-411d-9d18-a3cfe8ac5f3d",
      "fir_no": "KA-2026-AB4C24",
      "station_id": "28a62998-b184-4ead-be42-85ffb52a3134",
      "district_id": "01036fbe-c25c-4336-9014-edb51277c675",
      "crime_type": "theft",
      "ipc_sections": [
        "379"
      ],
      "incident_datetime": "2026-07-14T20:42:42.123376+05:30",
      "reported_datetime": "2026-07-14T20:42:42.123376+05:30",
      "address_text": "Integration Test Address",
      "mo_description": "Test MO",
      "status": "closed",
      "victim_age_bucket": null,
      "accused_count": 0,
      "weapon_used": null,
      "created_at": "2026-07-14T20:42:41.640846+05:30"
    },
    {
      "id": "9eb3b804-0a75-406e-bd42-fddd6de4d399",
      "fir_no": "KA-2026-55C17F",
      "station_id": "28a62998-b184-4ead-be42-85ffb52a3134",
      "district_id": "01036fbe-c25c-4336-9014-edb51277c675",
      "crime_type": "theft",
      "ipc_sections": [],
      "incident_datetime": "2026-07-14T18:40:50.069313+05:30",
      "reported_datetime": "2026-07-14T18:40:50.069313+05:30",
      "address_text": null,
      "mo_description": null,
      "status": "open",
      "victim_age_bucket": null,
      "accused_count": 0,
      "weapon_used": null,
      "created_at": "2026-07-14T18:40:49.518868+05:30"
    },
    {
      "id": "16e0d65b-86f9-4954-b63f-36949b86e866",
      "fir_no": "KA-2026-DC94C3",
      "station_id": "28a62998-b184-4ead-be42-85ffb52a3134",
      "district_id": "01036fbe-c25c-4336-9014-edb51277c675",
      "crime_type": "theft",
      "ipc_sections": [
        "379"
      ],
      "incident_datetime": "2026-07-14T18:40:47.854167+05:30",
      "reported_datetime": "2026-07-14T18:40:47.854167+05:30",
      "address_text": "Integration Test Address",
      "mo_description": "Test MO",
      "status": "closed",
      "victim_age_bucket": null,
      "accused_count": 0,
      "weapon_used": null,
      "created_at": "2026-07-14T18:40:47.410105+05:30"
    },
    {
      "id": "4ba0f30f-45b0-4b23-8502-8b1166954e49",
      "fir_no": "KA-2026-600CDB",
      "station_id": "28a62998-b184-4ead-be42-85ffb52a3134",
      "district_id": "01036fbe-c25c-4336-9014-edb51277c675",
      "crime_type": "theft",
      "ipc_sections": [],
      "incident_datetime": "2026-07-14T18:39:35.408816+05:30",
      "reported_datetime": "2026-07-14T18:39:35.408816+05:30",
      "address_text": null,
      "mo_description": null,
      "status": "open",
      "victim_age_bucket": null,
      "accused_count": 0,
      "weapon_used": null,
      "created_at": "2026-07-14T18:39:35.002479+05:30"
    },
    {
      "id": "d9ee8b97-8a6b-44d3-95ba-00ec423f1231",
      "fir_no": "KA-2026-4ABD55",
      "station_id": "28a62998-b184-4ead-be42-85ffb52a3134",
      "district_id": "01036fbe-c25c-4336-9014-edb51277c675",
      "crime_type": "theft",
      "ipc_sections": [
        "379"
      ],
      "incident_datetime": "2026-07-14T18:39:34.499885+05:30",
      "reported_datetime": "2026-07-14T18:39:34.499885+05:30",
      "address_text": "Integration Test Address",
      "mo_description": "Test MO",
      "status": "closed",
      "victim_age_bucket": null,
      "accused_count": 0,
      "weapon_used": null,
      "created_at": "2026-07-14T18:39:34.087850+05:30"
    },
    {
      "id": "eeed3d5c-37a4-4523-98d6-5a3ba4182372",
      "fir_no": "KA-2026-DB48B4",
      "station_id": "28a62998-b184-4ead-be42-85ffb52a3134",
      "district_id": "01036fbe-c25c-4336-9014-edb51277c675",
      "crime_type": "theft",
      "ipc_sections": [],
      "incident_datetime": "2026-07-14T18:38:21.429768+05:30",
      "reported_datetime": "2026-07-14T18:38:21.429768+05:30",
      "address_text": null,
      "mo_description": null,
      "status": "open",
      "victim_age_bucket": null,
      "accused_count": 0,
      "weapon_used": null,
      "created_at": "2026-07-14T18:38:21.013330+05:30"
    },
    {
      "id": "408edb5a-983a-4a68-b632-34c691d0f68b",
      "fir_no": "KA-2026-D2CFE1",
      "station_id": "28a62998-b184-4ead-be42-85ffb52a3134",
      "district_id": "01036fbe-c25c-4336-9014-edb51277c675",
      "crime_type": "theft",
      "ipc_sections": [
        "379"
      ],
      "incident_datetime": "2026-07-14T18:38:19.665437+05:30",
      "reported_datetime": "2026-07-14T18:38:19.665437+05:30",
      "address_text": "Integration Test Address",
      "mo_description": "Test MO",
      "status": "closed",
      "victim_age_bucket": null,
      "accused_count": 0,
      "weapon_used": null,
      "created_at": "2026-07-14T18:38:19.228080+05:30"
    },
    {
      "id": "f4b252f2-0dd2-45cb-9334-482805b1d214",
      "fir_no": "KA-2026-789C3F",
      "station_id": "28a62998-b184-4ead-be42-85ffb52a3134",
      "district_id": "01036fbe-c25c-4336-9014-edb51277c675",
      "crime_type": "theft",
      "ipc_sections": [],
      "incident_datetime": "2026-07-14T18:36:01.657284+05:30",
      "reported_datetime": "2026-07-14T18:36:01.657284+05:30",
      "address_text": null,
      "mo_description": null,
      "status": "open",
      "victim_age_bucket": null,
      "accused_count": 0,
      "weapon_used": null,
      "created_at": "2026-07-14T18:36:00.946519+05:30"
    },
    {
      "id": "45967a8e-c7c8-4f30-8de1-6627089b9f5f",
      "fir_no": "KA-2026-C1BA72",
      "station_id": "28a62998-b184-4ead-be42-85ffb52a3134",
      "district_id": "01036fbe-c25c-4336-9014-edb51277c675",
      "crime_type": "theft",
      "ipc_sections": [
        "379"
      ],
      "incident_datetime": "2026-07-14T18:36:00.039242+05:30",
      "reported_datetime": "2026-07-14T18:36:00.039242+05:30",
      "address_text": "Integration Test Address",
      "mo_description": "Test MO",
      "status": "closed",
      "victim_age_bucket": null,
      "accused_count": 0,
      "weapon_used": null,
      "created_at": "2026-07-14T18:35:59.590840+05:30"
    },
    {
      "id": "1482dfd4-16f8-42dd-b761-6fa5851b270f",
      "fir_no": "KA-2026-10D887",
      "station_id": "28a62998-b184-4ead-be42-85ffb52a3134",
      "district_id": "01036fbe-c25c-4336-9014-edb51277c675",
      "crime_type": "theft",
      "ipc_sections": [],
      "incident_datetime": "2026-07-14T18:31:20.765232+05:30",
      "reported_datetime": "2026-07-14T18:31:20.765232+05:30",
      "address_text": null,
      "mo_description": null,
      "status": "open",
      "victim_age_bucket": null,
      "accused_count": 0,
      "weapon_used": null,
      "created_at": "2026-07-14T18:31:20.044742+05:30"
    },
    {
      "id": "7aa8a496-8def-4135-88bd-b6c663cc5e86",
      "fir_no": "KA-2026-4F7E91",
      "station_id": "28a62998-b184-4ead-be42-85ffb52a3134",
      "district_id": "01036fbe-c25c-4336-9014-edb51277c675",
      "crime_type": "theft",
      "ipc_sections": [
        "379"
      ],
      "incident_datetime": "2026-07-14T18:31:19.345995+05:30",
      "reported_datetime": "2026-07-14T18:31:19.345995+05:30",
      "address_text": "Integration Test Address",
      "mo_description": "Test MO",
      "status": "closed",
      "victim_age_bucket": null,
      "accused_count": 0,
      "weapon_used": null,
      "created_at": "2026-07-14T18:31:18.706161+05:30"
    },
    {
      "id": "12256f40-e939-46db-a84c-685903a8b8e6",
      "fir_no": "KA-2026-AE185D",
      "station_id": "28a62998-b184-4ead-be42-85ffb52a3134",
      "district_id": "01036fbe-c25c-4336-9014-edb51277c675",
      "crime_type": "theft",
      "ipc_sections": [],
      "incident_datetime": "2026-07-14T18:29:08.881979+05:30",
      "reported_datetime": "2026-07-14T18:29:08.881979+05:30",
      "address_text": null,
      "mo_description": null,
      "status": "open",
      "victim_age_bucket": null,
      "accused_count": 0,
      "weapon_used": null,
      "created_at": "2026-07-14T18:29:08.263011+05:30"
    },
    {
      "id": "18db09a4-2008-455c-a04b-6b1ebf383e2e",
      "fir_no": "KA-2026-DCAA27",
      "station_id": "28a62998-b184-4ead-be42-85ffb52a3134",
      "district_id": "01036fbe-c25c-4336-9014-edb51277c675",
      "crime_type": "theft",
      "ipc_sections": [
        "379"
      ],
      "incident_datetime": "2026-07-14T18:29:07.925589+05:30",
      "reported_datetime": "2026-07-14T18:29:07.925589+05:30",
      "address_text": "Integration Test Address",
      "mo_description": "Test MO",
      "status": "closed",
      "victim_age_bucket": null,
      "accused_count": 0,
      "weapon_used": null,
      "created_at": "2026-07-14T18:29:07.058824+05:30"
    },
    {
      "id": "85447854-f88e-456a-8418-8f6e3c52ad95",
      "fir_no": "KA-2026-0AC4B5",
      "station_id": "28a62998-b184-4ead-be42-85ffb52a3134",
      "district_id": "01036fbe-c25c-4336-9014-edb51277c675",
      "crime_type": "theft",
      "ipc_sections": [],
      "incident_datetime": "2026-07-14T18:25:13.661353+05:30",
      "reported_datetime": "2026-07-14T18:25:13.661353+05:30",
      "address_text": null,
      "mo_description": null,
      "status": "open",
      "victim_age_bucket": null,
      "accused_count": 0,
      "weapon_used": null,
      "created_at": "2026-07-14T18:25:13.060517+05:30"
    },
    {
      "id": "a7196d06-6b56-4bb2-83a6-ba30dc0641a4",
      "fir_no": "KA-2026-4F38A2",
      "station_id": "28a62998-b184-4ead-be42-85ffb52a3134",
      "district_id": "01036fbe-c25c-4336-9014-edb51277c675",
      "crime_type": "theft",
      "ipc_sections": [
        "379"
      ],
      "incident_datetime": "2026-07-14T18:25:12.822448+05:30",
      "reported_datetime": "2026-07-14T18:25:12.822448+05:30",
      "address_text": "Integration Test Address",
      "mo_description": "Test MO",
      "status": "closed",
      "victim_age_bucket": null,
      "accused_count": 0,
      "weapon_used": null,
      "created_at": "2026-07-14T18:25:12.182115+05:30"
    }
  ],
  "total": 228,
  "page": 1,
  "page_size": 25,
  "total_pages": 10
}
  ```
  </details>
- **6. GET http://testserver/api/v1/fir/85dfc886-db69-413e-b6dc-b9740d3fc985** 
  - Status Code: 200
  - Execution Time: 11.99 ms
  - Response Size: 525 bytes
  <details><summary>Response</summary>
  ```json
  {
  "id": "85dfc886-db69-413e-b6dc-b9740d3fc985",
  "fir_no": "KA-2026-09CFC6",
  "station_id": "28a62998-b184-4ead-be42-85ffb52a3134",
  "district_id": "01036fbe-c25c-4336-9014-edb51277c675",
  "crime_type": "theft",
  "ipc_sections": [
    "379"
  ],
  "incident_datetime": "2026-07-14T21:01:20.666963+05:30",
  "reported_datetime": "2026-07-14T21:01:20.666963+05:30",
  "address_text": "Integration Test Address",
  "mo_description": "Test MO",
  "status": "open",
  "victim_age_bucket": null,
  "accused_count": 0,
  "weapon_used": null,
  "created_at": "2026-07-14T21:01:20.248767+05:30"
}
  ```
  </details>
- **7. PATCH http://testserver/api/v1/fir/85dfc886-db69-413e-b6dc-b9740d3fc985** 
  - Status Code: 200
  - Execution Time: 24.39 ms
  - Response Size: 527 bytes
  <details><summary>Payload</summary>
  ```json
  {
  "status": "closed"
}
  ```
  </details>
  <details><summary>Response</summary>
  ```json
  {
  "id": "85dfc886-db69-413e-b6dc-b9740d3fc985",
  "fir_no": "KA-2026-09CFC6",
  "station_id": "28a62998-b184-4ead-be42-85ffb52a3134",
  "district_id": "01036fbe-c25c-4336-9014-edb51277c675",
  "crime_type": "theft",
  "ipc_sections": [
    "379"
  ],
  "incident_datetime": "2026-07-14T21:01:20.666963+05:30",
  "reported_datetime": "2026-07-14T21:01:20.666963+05:30",
  "address_text": "Integration Test Address",
  "mo_description": "Test MO",
  "status": "closed",
  "victim_age_bucket": null,
  "accused_count": 0,
  "weapon_used": null,
  "created_at": "2026-07-14T21:01:20.248767+05:30"
}
  ```
  </details>
- **8. GET http://testserver/api/v1/fir/85dfc886-db69-413e-b6dc-b9740d3fc985** 
  - Status Code: 200
  - Execution Time: 8.36 ms
  - Response Size: 527 bytes
  <details><summary>Response</summary>
  ```json
  {
  "id": "85dfc886-db69-413e-b6dc-b9740d3fc985",
  "fir_no": "KA-2026-09CFC6",
  "station_id": "28a62998-b184-4ead-be42-85ffb52a3134",
  "district_id": "01036fbe-c25c-4336-9014-edb51277c675",
  "crime_type": "theft",
  "ipc_sections": [
    "379"
  ],
  "incident_datetime": "2026-07-14T21:01:20.666963+05:30",
  "reported_datetime": "2026-07-14T21:01:20.666963+05:30",
  "address_text": "Integration Test Address",
  "mo_description": "Test MO",
  "status": "closed",
  "victim_age_bucket": null,
  "accused_count": 0,
  "weapon_used": null,
  "created_at": "2026-07-14T21:01:20.248767+05:30"
}
  ```
  </details>
---

### tests/test_fir.py::test_fir_duplicate_no
**Status:** PASS
**Test Duration:** 0.05s
#### API Requests
- **1. POST http://testserver/api/v1/auth/login** 
  - Status Code: 200
  - Execution Time: 396.92 ms
  - Response Size: 647 bytes
  <details><summary>Payload</summary>
  ```json
  {
  "badge_no": "ADMIN001",
  "password": "Admin@123"
}
  ```
  </details>
  <details><summary>Response</summary>
  ```json
  {
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmYTM3MGUxNS05YjE2LTQ3OTUtYTA3Ni1jYmY5OGYwZTJhY2UiLCJ0eXBlIjoiYWNjZXNzIiwiaWF0IjoxNzg0MDQzMDgxLCJleHAiOjE3ODQwNDY2ODEsInJvbGUiOiJhZG1pbiJ9.igQo8lQRUQ-eAcmZDDaPbR1lTZOoi5AurjsmaJVEriU",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmYTM3MGUxNS05YjE2LTQ3OTUtYTA3Ni1jYmY5OGYwZTJhY2UiLCJ0eXBlIjoicmVmcmVzaCIsImlhdCI6MTc4NDA0MzA4MSwiZXhwIjoxNzg0NjQ3ODgxfQ.MaDAI2j9CY9ea-fSMqj2JJ4urLWMlMriswoiqvx5IHA",
  "token_type": "bearer",
  "user": {
    "id": "fa370e15-9b16-4795-a076-cbf98f0e2ace",
    "name": "System Admin",
    "badge_no": "ADMIN001",
    "role": "admin",
    "is_active": true,
    "station_id": null
  }
}
  ```
  </details>
- **2. GET http://testserver/api/v1/geo/districts** 
  - Status Code: 200
  - Execution Time: 7.95 ms
  - Response Size: 2981 bytes
  <details><summary>Response</summary>
  ```json
  [
  {
    "id": "01036fbe-c25c-4336-9014-edb51277c675",
    "name": "Bagalkot",
    "state": null,
    "population": null
  },
  {
    "id": "b6913b52-bfb3-4c89-b143-c7cf74c5bacf",
    "name": "Ballari",
    "state": null,
    "population": null
  },
  {
    "id": "c1484fd7-7f7a-476e-ba4a-2684448d7fbc",
    "name": "Belagavi",
    "state": null,
    "population": null
  },
  {
    "id": "e0328f8b-68a2-45c6-9e8e-195cb16c0b36",
    "name": "Bengaluru Rural",
    "state": null,
    "population": null
  },
  {
    "id": "920cfca7-4717-4546-95ad-5f295be019bf",
    "name": "Bengaluru Urban",
    "state": null,
    "population": null
  },
  {
    "id": "9dafcebe-47f5-4da7-a2e2-eb6bd69f6f50",
    "name": "Bidar",
    "state": null,
    "population": null
  },
  {
    "id": "4ded930b-2721-4ce8-bded-af87807b7816",
    "name": "Chamarajanagar",
    "state": null,
    "population": null
  },
  {
    "id": "2f82a9d4-18bd-4b2a-9c0f-a92099b66e98",
    "name": "Chikkaballapur",
    "state": null,
    "population": null
  },
  {
    "id": "72437c0e-f8fd-4ca2-9e27-0784343cb8ac",
    "name": "Chikkamagaluru",
    "state": null,
    "population": null
  },
  {
    "id": "9eb49de7-8983-4d1a-9987-22d4e438f6df",
    "name": "Chitradurga",
    "state": null,
    "population": null
  },
  {
    "id": "ef61a4f4-2fd5-4116-bea5-7fc2838d4b2c",
    "name": "Dakshina Kannada",
    "state": null,
    "population": null
  },
  {
    "id": "a1d9ee79-0a83-4392-9f9c-07e5d1015c48",
    "name": "Davanagere",
    "state": null,
    "population": null
  },
  {
    "id": "e4846dc4-b95b-4f6d-9614-7b2974bed954",
    "name": "Dharwad",
    "state": null,
    "population": null
  },
  {
    "id": "0e671165-ad57-427e-aa48-0b35eddad590",
    "name": "Gadag",
    "state": null,
    "population": null
  },
  {
    "id": "c556cace-805b-469b-a10f-3277c189c111",
    "name": "Hassan",
    "state": null,
    "population": null
  },
  {
    "id": "c7a32d16-de14-4c26-ba25-3fb497ea39a3",
    "name": "Haveri",
    "state": null,
    "population": null
  },
  {
    "id": "78fde344-43b4-4191-8aa6-53d893e72fa7",
    "name": "Kalaburagi",
    "state": null,
    "population": null
  },
  {
    "id": "2ddc1089-65bc-43fe-b684-e734f366223f",
    "name": "Kodagu",
    "state": null,
    "population": null
  },
  {
    "id": "d246ed3c-4c5a-401e-bfd0-f31fb2682a91",
    "name": "Kolar",
    "state": null,
    "population": null
  },
  {
    "id": "ecdc21bd-d555-4248-90a5-b451655d207b",
    "name": "Koppal",
    "state": null,
    "population": null
  },
  {
    "id": "9b5e4c14-9847-43da-a6c4-2cc44ae73b9e",
    "name": "Mandya",
    "state": null,
    "population": null
  },
  {
    "id": "b7d572b4-bc49-4422-87aa-53b216f50e39",
    "name": "Mysuru",
    "state": null,
    "population": null
  },
  {
    "id": "c7af75ff-044e-4af7-a251-e3bd6fbe8a03",
    "name": "Raichur",
    "state": null,
    "population": null
  },
  {
    "id": "53f17eb6-04d9-4785-bd23-6e93bacd7052",
    "name": "Ramanagara",
    "state": null,
    "population": null
  },
  {
    "id": "a3401b0c-0d9d-48dd-a7de-58e1822e7b34",
    "name": "Shivamogga",
    "state": null,
    "population": null
  },
  {
    "id": "2aa29b7b-7a16-494d-ab20-6ac4b046d38e",
    "name": "Test District",
    "state": null,
    "population": null
  },
  {
    "id": "57a16457-3924-47fe-93ff-3d712f898179",
    "name": "Tumakuru",
    "state": null,
    "population": null
  },
  {
    "id": "84e906c4-9615-4beb-a611-3b2d4977e53b",
    "name": "Udupi",
    "state": null,
    "population": null
  },
  {
    "id": "3826cad2-e3e6-4823-bb63-e6c6431704e9",
    "name": "Uttara Kannada",
    "state": null,
    "population": null
  },
  {
    "id": "e7257647-bbf9-4610-a0e2-48fc9a59db40",
    "name": "Vijayapura",
    "state": null,
    "population": null
  },
  {
    "id": "bd9f6476-f661-43d0-bdf1-d34d12c3d04a",
    "name": "Yadgir",
    "state": null,
    "population": null
  }
]
  ```
  </details>
- **3. GET http://testserver/api/v1/geo/districts** 
  - Status Code: 200
  - Execution Time: 6.95 ms
  - Response Size: 2981 bytes
  <details><summary>Response</summary>
  ```json
  [
  {
    "id": "01036fbe-c25c-4336-9014-edb51277c675",
    "name": "Bagalkot",
    "state": null,
    "population": null
  },
  {
    "id": "b6913b52-bfb3-4c89-b143-c7cf74c5bacf",
    "name": "Ballari",
    "state": null,
    "population": null
  },
  {
    "id": "c1484fd7-7f7a-476e-ba4a-2684448d7fbc",
    "name": "Belagavi",
    "state": null,
    "population": null
  },
  {
    "id": "e0328f8b-68a2-45c6-9e8e-195cb16c0b36",
    "name": "Bengaluru Rural",
    "state": null,
    "population": null
  },
  {
    "id": "920cfca7-4717-4546-95ad-5f295be019bf",
    "name": "Bengaluru Urban",
    "state": null,
    "population": null
  },
  {
    "id": "9dafcebe-47f5-4da7-a2e2-eb6bd69f6f50",
    "name": "Bidar",
    "state": null,
    "population": null
  },
  {
    "id": "4ded930b-2721-4ce8-bded-af87807b7816",
    "name": "Chamarajanagar",
    "state": null,
    "population": null
  },
  {
    "id": "2f82a9d4-18bd-4b2a-9c0f-a92099b66e98",
    "name": "Chikkaballapur",
    "state": null,
    "population": null
  },
  {
    "id": "72437c0e-f8fd-4ca2-9e27-0784343cb8ac",
    "name": "Chikkamagaluru",
    "state": null,
    "population": null
  },
  {
    "id": "9eb49de7-8983-4d1a-9987-22d4e438f6df",
    "name": "Chitradurga",
    "state": null,
    "population": null
  },
  {
    "id": "ef61a4f4-2fd5-4116-bea5-7fc2838d4b2c",
    "name": "Dakshina Kannada",
    "state": null,
    "population": null
  },
  {
    "id": "a1d9ee79-0a83-4392-9f9c-07e5d1015c48",
    "name": "Davanagere",
    "state": null,
    "population": null
  },
  {
    "id": "e4846dc4-b95b-4f6d-9614-7b2974bed954",
    "name": "Dharwad",
    "state": null,
    "population": null
  },
  {
    "id": "0e671165-ad57-427e-aa48-0b35eddad590",
    "name": "Gadag",
    "state": null,
    "population": null
  },
  {
    "id": "c556cace-805b-469b-a10f-3277c189c111",
    "name": "Hassan",
    "state": null,
    "population": null
  },
  {
    "id": "c7a32d16-de14-4c26-ba25-3fb497ea39a3",
    "name": "Haveri",
    "state": null,
    "population": null
  },
  {
    "id": "78fde344-43b4-4191-8aa6-53d893e72fa7",
    "name": "Kalaburagi",
    "state": null,
    "population": null
  },
  {
    "id": "2ddc1089-65bc-43fe-b684-e734f366223f",
    "name": "Kodagu",
    "state": null,
    "population": null
  },
  {
    "id": "d246ed3c-4c5a-401e-bfd0-f31fb2682a91",
    "name": "Kolar",
    "state": null,
    "population": null
  },
  {
    "id": "ecdc21bd-d555-4248-90a5-b451655d207b",
    "name": "Koppal",
    "state": null,
    "population": null
  },
  {
    "id": "9b5e4c14-9847-43da-a6c4-2cc44ae73b9e",
    "name": "Mandya",
    "state": null,
    "population": null
  },
  {
    "id": "b7d572b4-bc49-4422-87aa-53b216f50e39",
    "name": "Mysuru",
    "state": null,
    "population": null
  },
  {
    "id": "c7af75ff-044e-4af7-a251-e3bd6fbe8a03",
    "name": "Raichur",
    "state": null,
    "population": null
  },
  {
    "id": "53f17eb6-04d9-4785-bd23-6e93bacd7052",
    "name": "Ramanagara",
    "state": null,
    "population": null
  },
  {
    "id": "a3401b0c-0d9d-48dd-a7de-58e1822e7b34",
    "name": "Shivamogga",
    "state": null,
    "population": null
  },
  {
    "id": "2aa29b7b-7a16-494d-ab20-6ac4b046d38e",
    "name": "Test District",
    "state": null,
    "population": null
  },
  {
    "id": "57a16457-3924-47fe-93ff-3d712f898179",
    "name": "Tumakuru",
    "state": null,
    "population": null
  },
  {
    "id": "84e906c4-9615-4beb-a611-3b2d4977e53b",
    "name": "Udupi",
    "state": null,
    "population": null
  },
  {
    "id": "3826cad2-e3e6-4823-bb63-e6c6431704e9",
    "name": "Uttara Kannada",
    "state": null,
    "population": null
  },
  {
    "id": "e7257647-bbf9-4610-a0e2-48fc9a59db40",
    "name": "Vijayapura",
    "state": null,
    "population": null
  },
  {
    "id": "bd9f6476-f661-43d0-bdf1-d34d12c3d04a",
    "name": "Yadgir",
    "state": null,
    "population": null
  }
]
  ```
  </details>
- **4. POST http://testserver/api/v1/fir** 
  - Status Code: 201
  - Execution Time: 19.80 ms
  - Response Size: 493 bytes
  <details><summary>Payload</summary>
  ```json
  {
  "fir_no": "KA-2026-95C0F3",
  "station_id": "28a62998-b184-4ead-be42-85ffb52a3134",
  "district_id": "01036fbe-c25c-4336-9014-edb51277c675",
  "crime_type": "theft",
  "incident_datetime": "2026-07-14T15:31:21.218080+00:00",
  "reported_datetime": "2026-07-14T15:31:21.218080+00:00",
  "location": {
    "lat": 12.9716,
    "lng": 77.5946
  }
}
  ```
  </details>
  <details><summary>Response</summary>
  ```json
  {
  "id": "7897c3ba-b377-4b2b-b66d-5b7a039ecae2",
  "fir_no": "KA-2026-95C0F3",
  "station_id": "28a62998-b184-4ead-be42-85ffb52a3134",
  "district_id": "01036fbe-c25c-4336-9014-edb51277c675",
  "crime_type": "theft",
  "ipc_sections": [],
  "incident_datetime": "2026-07-14T21:01:21.218080+05:30",
  "reported_datetime": "2026-07-14T21:01:21.218080+05:30",
  "address_text": null,
  "mo_description": null,
  "status": "open",
  "victim_age_bucket": null,
  "accused_count": 0,
  "weapon_used": null,
  "created_at": "2026-07-14T21:01:20.801882+05:30"
}
  ```
  </details>
- **5. POST http://testserver/api/v1/fir** 
  - Status Code: 409
  - Execution Time: 13.51 ms
  - Response Size: 56 bytes
  <details><summary>Payload</summary>
  ```json
  {
  "fir_no": "KA-2026-95C0F3",
  "station_id": "28a62998-b184-4ead-be42-85ffb52a3134",
  "district_id": "01036fbe-c25c-4336-9014-edb51277c675",
  "crime_type": "theft",
  "incident_datetime": "2026-07-14T15:31:21.218080+00:00",
  "reported_datetime": "2026-07-14T15:31:21.218080+00:00",
  "location": {
    "lat": 12.9716,
    "lng": 77.5946
  }
}
  ```
  </details>
  <details><summary>Response</summary>
  ```json
  {
  "detail": "FIR number 'KA-2026-95C0F3' already exists."
}
  ```
  </details>
---

### tests/test_fir.py::test_fir_invalid_payload
**Status:** PASS
**Test Duration:** 0.03s
#### API Requests
- **1. POST http://testserver/api/v1/auth/login** 
  - Status Code: 200
  - Execution Time: 498.81 ms
  - Response Size: 647 bytes
  <details><summary>Payload</summary>
  ```json
  {
  "badge_no": "ADMIN001",
  "password": "Admin@123"
}
  ```
  </details>
  <details><summary>Response</summary>
  ```json
  {
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmYTM3MGUxNS05YjE2LTQ3OTUtYTA3Ni1jYmY5OGYwZTJhY2UiLCJ0eXBlIjoiYWNjZXNzIiwiaWF0IjoxNzg0MDQzMDgxLCJleHAiOjE3ODQwNDY2ODEsInJvbGUiOiJhZG1pbiJ9.igQo8lQRUQ-eAcmZDDaPbR1lTZOoi5AurjsmaJVEriU",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmYTM3MGUxNS05YjE2LTQ3OTUtYTA3Ni1jYmY5OGYwZTJhY2UiLCJ0eXBlIjoicmVmcmVzaCIsImlhdCI6MTc4NDA0MzA4MSwiZXhwIjoxNzg0NjQ3ODgxfQ.MaDAI2j9CY9ea-fSMqj2JJ4urLWMlMriswoiqvx5IHA",
  "token_type": "bearer",
  "user": {
    "id": "fa370e15-9b16-4795-a076-cbf98f0e2ace",
    "name": "System Admin",
    "badge_no": "ADMIN001",
    "role": "admin",
    "is_active": true,
    "station_id": null
  }
}
  ```
  </details>
- **2. GET http://testserver/api/v1/geo/districts** 
  - Status Code: 200
  - Execution Time: 7.28 ms
  - Response Size: 2981 bytes
  <details><summary>Response</summary>
  ```json
  [
  {
    "id": "01036fbe-c25c-4336-9014-edb51277c675",
    "name": "Bagalkot",
    "state": null,
    "population": null
  },
  {
    "id": "b6913b52-bfb3-4c89-b143-c7cf74c5bacf",
    "name": "Ballari",
    "state": null,
    "population": null
  },
  {
    "id": "c1484fd7-7f7a-476e-ba4a-2684448d7fbc",
    "name": "Belagavi",
    "state": null,
    "population": null
  },
  {
    "id": "e0328f8b-68a2-45c6-9e8e-195cb16c0b36",
    "name": "Bengaluru Rural",
    "state": null,
    "population": null
  },
  {
    "id": "920cfca7-4717-4546-95ad-5f295be019bf",
    "name": "Bengaluru Urban",
    "state": null,
    "population": null
  },
  {
    "id": "9dafcebe-47f5-4da7-a2e2-eb6bd69f6f50",
    "name": "Bidar",
    "state": null,
    "population": null
  },
  {
    "id": "4ded930b-2721-4ce8-bded-af87807b7816",
    "name": "Chamarajanagar",
    "state": null,
    "population": null
  },
  {
    "id": "2f82a9d4-18bd-4b2a-9c0f-a92099b66e98",
    "name": "Chikkaballapur",
    "state": null,
    "population": null
  },
  {
    "id": "72437c0e-f8fd-4ca2-9e27-0784343cb8ac",
    "name": "Chikkamagaluru",
    "state": null,
    "population": null
  },
  {
    "id": "9eb49de7-8983-4d1a-9987-22d4e438f6df",
    "name": "Chitradurga",
    "state": null,
    "population": null
  },
  {
    "id": "ef61a4f4-2fd5-4116-bea5-7fc2838d4b2c",
    "name": "Dakshina Kannada",
    "state": null,
    "population": null
  },
  {
    "id": "a1d9ee79-0a83-4392-9f9c-07e5d1015c48",
    "name": "Davanagere",
    "state": null,
    "population": null
  },
  {
    "id": "e4846dc4-b95b-4f6d-9614-7b2974bed954",
    "name": "Dharwad",
    "state": null,
    "population": null
  },
  {
    "id": "0e671165-ad57-427e-aa48-0b35eddad590",
    "name": "Gadag",
    "state": null,
    "population": null
  },
  {
    "id": "c556cace-805b-469b-a10f-3277c189c111",
    "name": "Hassan",
    "state": null,
    "population": null
  },
  {
    "id": "c7a32d16-de14-4c26-ba25-3fb497ea39a3",
    "name": "Haveri",
    "state": null,
    "population": null
  },
  {
    "id": "78fde344-43b4-4191-8aa6-53d893e72fa7",
    "name": "Kalaburagi",
    "state": null,
    "population": null
  },
  {
    "id": "2ddc1089-65bc-43fe-b684-e734f366223f",
    "name": "Kodagu",
    "state": null,
    "population": null
  },
  {
    "id": "d246ed3c-4c5a-401e-bfd0-f31fb2682a91",
    "name": "Kolar",
    "state": null,
    "population": null
  },
  {
    "id": "ecdc21bd-d555-4248-90a5-b451655d207b",
    "name": "Koppal",
    "state": null,
    "population": null
  },
  {
    "id": "9b5e4c14-9847-43da-a6c4-2cc44ae73b9e",
    "name": "Mandya",
    "state": null,
    "population": null
  },
  {
    "id": "b7d572b4-bc49-4422-87aa-53b216f50e39",
    "name": "Mysuru",
    "state": null,
    "population": null
  },
  {
    "id": "c7af75ff-044e-4af7-a251-e3bd6fbe8a03",
    "name": "Raichur",
    "state": null,
    "population": null
  },
  {
    "id": "53f17eb6-04d9-4785-bd23-6e93bacd7052",
    "name": "Ramanagara",
    "state": null,
    "population": null
  },
  {
    "id": "a3401b0c-0d9d-48dd-a7de-58e1822e7b34",
    "name": "Shivamogga",
    "state": null,
    "population": null
  },
  {
    "id": "2aa29b7b-7a16-494d-ab20-6ac4b046d38e",
    "name": "Test District",
    "state": null,
    "population": null
  },
  {
    "id": "57a16457-3924-47fe-93ff-3d712f898179",
    "name": "Tumakuru",
    "state": null,
    "population": null
  },
  {
    "id": "84e906c4-9615-4beb-a611-3b2d4977e53b",
    "name": "Udupi",
    "state": null,
    "population": null
  },
  {
    "id": "3826cad2-e3e6-4823-bb63-e6c6431704e9",
    "name": "Uttara Kannada",
    "state": null,
    "population": null
  },
  {
    "id": "e7257647-bbf9-4610-a0e2-48fc9a59db40",
    "name": "Vijayapura",
    "state": null,
    "population": null
  },
  {
    "id": "bd9f6476-f661-43d0-bdf1-d34d12c3d04a",
    "name": "Yadgir",
    "state": null,
    "population": null
  }
]
  ```
  </details>
- **3. GET http://testserver/api/v1/geo/districts** 
  - Status Code: 200
  - Execution Time: 6.76 ms
  - Response Size: 2981 bytes
  <details><summary>Response</summary>
  ```json
  [
  {
    "id": "01036fbe-c25c-4336-9014-edb51277c675",
    "name": "Bagalkot",
    "state": null,
    "population": null
  },
  {
    "id": "b6913b52-bfb3-4c89-b143-c7cf74c5bacf",
    "name": "Ballari",
    "state": null,
    "population": null
  },
  {
    "id": "c1484fd7-7f7a-476e-ba4a-2684448d7fbc",
    "name": "Belagavi",
    "state": null,
    "population": null
  },
  {
    "id": "e0328f8b-68a2-45c6-9e8e-195cb16c0b36",
    "name": "Bengaluru Rural",
    "state": null,
    "population": null
  },
  {
    "id": "920cfca7-4717-4546-95ad-5f295be019bf",
    "name": "Bengaluru Urban",
    "state": null,
    "population": null
  },
  {
    "id": "9dafcebe-47f5-4da7-a2e2-eb6bd69f6f50",
    "name": "Bidar",
    "state": null,
    "population": null
  },
  {
    "id": "4ded930b-2721-4ce8-bded-af87807b7816",
    "name": "Chamarajanagar",
    "state": null,
    "population": null
  },
  {
    "id": "2f82a9d4-18bd-4b2a-9c0f-a92099b66e98",
    "name": "Chikkaballapur",
    "state": null,
    "population": null
  },
  {
    "id": "72437c0e-f8fd-4ca2-9e27-0784343cb8ac",
    "name": "Chikkamagaluru",
    "state": null,
    "population": null
  },
  {
    "id": "9eb49de7-8983-4d1a-9987-22d4e438f6df",
    "name": "Chitradurga",
    "state": null,
    "population": null
  },
  {
    "id": "ef61a4f4-2fd5-4116-bea5-7fc2838d4b2c",
    "name": "Dakshina Kannada",
    "state": null,
    "population": null
  },
  {
    "id": "a1d9ee79-0a83-4392-9f9c-07e5d1015c48",
    "name": "Davanagere",
    "state": null,
    "population": null
  },
  {
    "id": "e4846dc4-b95b-4f6d-9614-7b2974bed954",
    "name": "Dharwad",
    "state": null,
    "population": null
  },
  {
    "id": "0e671165-ad57-427e-aa48-0b35eddad590",
    "name": "Gadag",
    "state": null,
    "population": null
  },
  {
    "id": "c556cace-805b-469b-a10f-3277c189c111",
    "name": "Hassan",
    "state": null,
    "population": null
  },
  {
    "id": "c7a32d16-de14-4c26-ba25-3fb497ea39a3",
    "name": "Haveri",
    "state": null,
    "population": null
  },
  {
    "id": "78fde344-43b4-4191-8aa6-53d893e72fa7",
    "name": "Kalaburagi",
    "state": null,
    "population": null
  },
  {
    "id": "2ddc1089-65bc-43fe-b684-e734f366223f",
    "name": "Kodagu",
    "state": null,
    "population": null
  },
  {
    "id": "d246ed3c-4c5a-401e-bfd0-f31fb2682a91",
    "name": "Kolar",
    "state": null,
    "population": null
  },
  {
    "id": "ecdc21bd-d555-4248-90a5-b451655d207b",
    "name": "Koppal",
    "state": null,
    "population": null
  },
  {
    "id": "9b5e4c14-9847-43da-a6c4-2cc44ae73b9e",
    "name": "Mandya",
    "state": null,
    "population": null
  },
  {
    "id": "b7d572b4-bc49-4422-87aa-53b216f50e39",
    "name": "Mysuru",
    "state": null,
    "population": null
  },
  {
    "id": "c7af75ff-044e-4af7-a251-e3bd6fbe8a03",
    "name": "Raichur",
    "state": null,
    "population": null
  },
  {
    "id": "53f17eb6-04d9-4785-bd23-6e93bacd7052",
    "name": "Ramanagara",
    "state": null,
    "population": null
  },
  {
    "id": "a3401b0c-0d9d-48dd-a7de-58e1822e7b34",
    "name": "Shivamogga",
    "state": null,
    "population": null
  },
  {
    "id": "2aa29b7b-7a16-494d-ab20-6ac4b046d38e",
    "name": "Test District",
    "state": null,
    "population": null
  },
  {
    "id": "57a16457-3924-47fe-93ff-3d712f898179",
    "name": "Tumakuru",
    "state": null,
    "population": null
  },
  {
    "id": "84e906c4-9615-4beb-a611-3b2d4977e53b",
    "name": "Udupi",
    "state": null,
    "population": null
  },
  {
    "id": "3826cad2-e3e6-4823-bb63-e6c6431704e9",
    "name": "Uttara Kannada",
    "state": null,
    "population": null
  },
  {
    "id": "e7257647-bbf9-4610-a0e2-48fc9a59db40",
    "name": "Vijayapura",
    "state": null,
    "population": null
  },
  {
    "id": "bd9f6476-f661-43d0-bdf1-d34d12c3d04a",
    "name": "Yadgir",
    "state": null,
    "population": null
  }
]
  ```
  </details>
- **4. POST http://testserver/api/v1/fir** 
  - Status Code: 422
  - Execution Time: 9.34 ms
  - Response Size: 352 bytes
  <details><summary>Payload</summary>
  ```json
  {
  "fir_no": "KA-2026-3D6D7C",
  "station_id": "28a62998-b184-4ead-be42-85ffb52a3134",
  "district_id": "01036fbe-c25c-4336-9014-edb51277c675",
  "crime_type": "theft",
  "incident_datetime": "2026-07-14T15:31:21.791005+00:00",
  "reported_datetime": "2026-07-14T15:31:21.791005+00:00"
}
  ```
  </details>
  <details><summary>Response</summary>
  ```json
  {
  "detail": [
    {
      "type": "missing",
      "loc": [
        "body",
        "location"
      ],
      "msg": "Field required",
      "input": {
        "fir_no": "KA-2026-3D6D7C",
        "station_id": "28a62998-b184-4ead-be42-85ffb52a3134",
        "district_id": "01036fbe-c25c-4336-9014-edb51277c675",
        "crime_type": "theft",
        "incident_datetime": "2026-07-14T15:31:21.791005+00:00",
        "reported_datetime": "2026-07-14T15:31:21.791005+00:00"
      }
    }
  ]
}
  ```
  </details>
---

### tests/test_fir.py::test_fir_nonexistent_id
**Status:** PASS
**Test Duration:** 0.01s
#### API Requests
- **1. POST http://testserver/api/v1/auth/login** 
  - Status Code: 200
  - Execution Time: 374.89 ms
  - Response Size: 647 bytes
  <details><summary>Payload</summary>
  ```json
  {
  "badge_no": "ADMIN001",
  "password": "Admin@123"
}
  ```
  </details>
  <details><summary>Response</summary>
  ```json
  {
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmYTM3MGUxNS05YjE2LTQ3OTUtYTA3Ni1jYmY5OGYwZTJhY2UiLCJ0eXBlIjoiYWNjZXNzIiwiaWF0IjoxNzg0MDQzMDgyLCJleHAiOjE3ODQwNDY2ODIsInJvbGUiOiJhZG1pbiJ9._83K1pMVLjymDnYx0FAcoD5RZ09e-GebHpzbk6-3bNk",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmYTM3MGUxNS05YjE2LTQ3OTUtYTA3Ni1jYmY5OGYwZTJhY2UiLCJ0eXBlIjoicmVmcmVzaCIsImlhdCI6MTc4NDA0MzA4MiwiZXhwIjoxNzg0NjQ3ODgyfQ.1YJlPPZq2ehto_IrCgWohv0WfdYl_9BmWeGhLM50SXU",
  "token_type": "bearer",
  "user": {
    "id": "fa370e15-9b16-4795-a076-cbf98f0e2ace",
    "name": "System Admin",
    "badge_no": "ADMIN001",
    "role": "admin",
    "is_active": true,
    "station_id": null
  }
}
  ```
  </details>
- **2. GET http://testserver/api/v1/fir/3d7b5c97-ef43-40fb-a0e4-e3844e14abfa** 
  - Status Code: 404
  - Execution Time: 5.67 ms
  - Response Size: 64 bytes
  <details><summary>Response</summary>
  ```json
  {
  "detail": "FIR 3d7b5c97-ef43-40fb-a0e4-e3844e14abfa not found."
}
  ```
  </details>
---

### tests/test_geo.py::test_get_districts
**Status:** PASS
**Test Duration:** 0.01s
#### API Requests
- **1. POST http://testserver/api/v1/auth/login** 
  - Status Code: 200
  - Execution Time: 391.42 ms
  - Response Size: 647 bytes
  <details><summary>Payload</summary>
  ```json
  {
  "badge_no": "ADMIN001",
  "password": "Admin@123"
}
  ```
  </details>
  <details><summary>Response</summary>
  ```json
  {
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmYTM3MGUxNS05YjE2LTQ3OTUtYTA3Ni1jYmY5OGYwZTJhY2UiLCJ0eXBlIjoiYWNjZXNzIiwiaWF0IjoxNzg0MDQzMDgyLCJleHAiOjE3ODQwNDY2ODIsInJvbGUiOiJhZG1pbiJ9._83K1pMVLjymDnYx0FAcoD5RZ09e-GebHpzbk6-3bNk",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmYTM3MGUxNS05YjE2LTQ3OTUtYTA3Ni1jYmY5OGYwZTJhY2UiLCJ0eXBlIjoicmVmcmVzaCIsImlhdCI6MTc4NDA0MzA4MiwiZXhwIjoxNzg0NjQ3ODgyfQ.1YJlPPZq2ehto_IrCgWohv0WfdYl_9BmWeGhLM50SXU",
  "token_type": "bearer",
  "user": {
    "id": "fa370e15-9b16-4795-a076-cbf98f0e2ace",
    "name": "System Admin",
    "badge_no": "ADMIN001",
    "role": "admin",
    "is_active": true,
    "station_id": null
  }
}
  ```
  </details>
- **2. GET http://testserver/api/v1/geo/districts** 
  - Status Code: 200
  - Execution Time: 6.53 ms
  - Response Size: 2981 bytes
  <details><summary>Response</summary>
  ```json
  [
  {
    "id": "01036fbe-c25c-4336-9014-edb51277c675",
    "name": "Bagalkot",
    "state": null,
    "population": null
  },
  {
    "id": "b6913b52-bfb3-4c89-b143-c7cf74c5bacf",
    "name": "Ballari",
    "state": null,
    "population": null
  },
  {
    "id": "c1484fd7-7f7a-476e-ba4a-2684448d7fbc",
    "name": "Belagavi",
    "state": null,
    "population": null
  },
  {
    "id": "e0328f8b-68a2-45c6-9e8e-195cb16c0b36",
    "name": "Bengaluru Rural",
    "state": null,
    "population": null
  },
  {
    "id": "920cfca7-4717-4546-95ad-5f295be019bf",
    "name": "Bengaluru Urban",
    "state": null,
    "population": null
  },
  {
    "id": "9dafcebe-47f5-4da7-a2e2-eb6bd69f6f50",
    "name": "Bidar",
    "state": null,
    "population": null
  },
  {
    "id": "4ded930b-2721-4ce8-bded-af87807b7816",
    "name": "Chamarajanagar",
    "state": null,
    "population": null
  },
  {
    "id": "2f82a9d4-18bd-4b2a-9c0f-a92099b66e98",
    "name": "Chikkaballapur",
    "state": null,
    "population": null
  },
  {
    "id": "72437c0e-f8fd-4ca2-9e27-0784343cb8ac",
    "name": "Chikkamagaluru",
    "state": null,
    "population": null
  },
  {
    "id": "9eb49de7-8983-4d1a-9987-22d4e438f6df",
    "name": "Chitradurga",
    "state": null,
    "population": null
  },
  {
    "id": "ef61a4f4-2fd5-4116-bea5-7fc2838d4b2c",
    "name": "Dakshina Kannada",
    "state": null,
    "population": null
  },
  {
    "id": "a1d9ee79-0a83-4392-9f9c-07e5d1015c48",
    "name": "Davanagere",
    "state": null,
    "population": null
  },
  {
    "id": "e4846dc4-b95b-4f6d-9614-7b2974bed954",
    "name": "Dharwad",
    "state": null,
    "population": null
  },
  {
    "id": "0e671165-ad57-427e-aa48-0b35eddad590",
    "name": "Gadag",
    "state": null,
    "population": null
  },
  {
    "id": "c556cace-805b-469b-a10f-3277c189c111",
    "name": "Hassan",
    "state": null,
    "population": null
  },
  {
    "id": "c7a32d16-de14-4c26-ba25-3fb497ea39a3",
    "name": "Haveri",
    "state": null,
    "population": null
  },
  {
    "id": "78fde344-43b4-4191-8aa6-53d893e72fa7",
    "name": "Kalaburagi",
    "state": null,
    "population": null
  },
  {
    "id": "2ddc1089-65bc-43fe-b684-e734f366223f",
    "name": "Kodagu",
    "state": null,
    "population": null
  },
  {
    "id": "d246ed3c-4c5a-401e-bfd0-f31fb2682a91",
    "name": "Kolar",
    "state": null,
    "population": null
  },
  {
    "id": "ecdc21bd-d555-4248-90a5-b451655d207b",
    "name": "Koppal",
    "state": null,
    "population": null
  },
  {
    "id": "9b5e4c14-9847-43da-a6c4-2cc44ae73b9e",
    "name": "Mandya",
    "state": null,
    "population": null
  },
  {
    "id": "b7d572b4-bc49-4422-87aa-53b216f50e39",
    "name": "Mysuru",
    "state": null,
    "population": null
  },
  {
    "id": "c7af75ff-044e-4af7-a251-e3bd6fbe8a03",
    "name": "Raichur",
    "state": null,
    "population": null
  },
  {
    "id": "53f17eb6-04d9-4785-bd23-6e93bacd7052",
    "name": "Ramanagara",
    "state": null,
    "population": null
  },
  {
    "id": "a3401b0c-0d9d-48dd-a7de-58e1822e7b34",
    "name": "Shivamogga",
    "state": null,
    "population": null
  },
  {
    "id": "2aa29b7b-7a16-494d-ab20-6ac4b046d38e",
    "name": "Test District",
    "state": null,
    "population": null
  },
  {
    "id": "57a16457-3924-47fe-93ff-3d712f898179",
    "name": "Tumakuru",
    "state": null,
    "population": null
  },
  {
    "id": "84e906c4-9615-4beb-a611-3b2d4977e53b",
    "name": "Udupi",
    "state": null,
    "population": null
  },
  {
    "id": "3826cad2-e3e6-4823-bb63-e6c6431704e9",
    "name": "Uttara Kannada",
    "state": null,
    "population": null
  },
  {
    "id": "e7257647-bbf9-4610-a0e2-48fc9a59db40",
    "name": "Vijayapura",
    "state": null,
    "population": null
  },
  {
    "id": "bd9f6476-f661-43d0-bdf1-d34d12c3d04a",
    "name": "Yadgir",
    "state": null,
    "population": null
  }
]
  ```
  </details>
---

### tests/test_geo.py::test_get_heatmap
**Status:** PASS
**Test Duration:** 0.02s
#### API Requests
- **1. POST http://testserver/api/v1/auth/login** 
  - Status Code: 200
  - Execution Time: 441.62 ms
  - Response Size: 647 bytes
  <details><summary>Payload</summary>
  ```json
  {
  "badge_no": "ADMIN001",
  "password": "Admin@123"
}
  ```
  </details>
  <details><summary>Response</summary>
  ```json
  {
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmYTM3MGUxNS05YjE2LTQ3OTUtYTA3Ni1jYmY5OGYwZTJhY2UiLCJ0eXBlIjoiYWNjZXNzIiwiaWF0IjoxNzg0MDQzMDgzLCJleHAiOjE3ODQwNDY2ODMsInJvbGUiOiJhZG1pbiJ9.3LCsAFPGKxjjMG8H1f5yqWZg6W5QbRUXeoYiQpiO4YM",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmYTM3MGUxNS05YjE2LTQ3OTUtYTA3Ni1jYmY5OGYwZTJhY2UiLCJ0eXBlIjoicmVmcmVzaCIsImlhdCI6MTc4NDA0MzA4MywiZXhwIjoxNzg0NjQ3ODgzfQ.W509c3OVJ1ePDUsGMRUZZhUqp1TvL1vZ2YCL0afDi90",
  "token_type": "bearer",
  "user": {
    "id": "fa370e15-9b16-4795-a076-cbf98f0e2ace",
    "name": "System Admin",
    "badge_no": "ADMIN001",
    "role": "admin",
    "is_active": true,
    "station_id": null
  }
}
  ```
  </details>
- **2. GET http://testserver/api/v1/geo/heatmap** 
  - Status Code: 200
  - Execution Time: 20.37 ms
  - Response Size: 2255 bytes
  <details><summary>Response</summary>
  ```json
  {
  "district_id": null,
  "window": "7d",
  "points": [
    {
      "lat": 17.198868550489852,
      "lng": 75.56108349451958,
      "weight": 1.0,
      "crime_type": "cybercrime"
    },
    {
      "lat": 16.77548913815821,
      "lng": 74.85959465138265,
      "weight": 1.0,
      "crime_type": "assault"
    },
    {
      "lat": 15.531768620353507,
      "lng": 75.4637600058583,
      "weight": 1.0,
      "crime_type": "missing_person"
    },
    {
      "lat": 17.944517286679925,
      "lng": 78.47968108570551,
      "weight": 1.0,
      "crime_type": "other"
    },
    {
      "lat": 12.9716,
      "lng": 77.5946,
      "weight": 1.0,
      "crime_type": "theft"
    },
    {
      "lat": 12.9716,
      "lng": 77.5946,
      "weight": 1.0,
      "crime_type": "theft"
    },
    {
      "lat": 12.9716,
      "lng": 77.5946,
      "weight": 1.0,
      "crime_type": "theft"
    },
    {
      "lat": 12.9716,
      "lng": 77.5946,
      "weight": 1.0,
      "crime_type": "theft"
    },
    {
      "lat": 12.9716,
      "lng": 77.5946,
      "weight": 1.0,
      "crime_type": "theft"
    },
    {
      "lat": 12.9716,
      "lng": 77.5946,
      "weight": 1.0,
      "crime_type": "theft"
    },
    {
      "lat": 12.9716,
      "lng": 77.5946,
      "weight": 1.0,
      "crime_type": "theft"
    },
    {
      "lat": 12.9716,
      "lng": 77.5946,
      "weight": 1.0,
      "crime_type": "theft"
    },
    {
      "lat": 12.9716,
      "lng": 77.5946,
      "weight": 1.0,
      "crime_type": "theft"
    },
    {
      "lat": 12.9716,
      "lng": 77.5946,
      "weight": 1.0,
      "crime_type": "theft"
    },
    {
      "lat": 12.9716,
      "lng": 77.5946,
      "weight": 1.0,
      "crime_type": "theft"
    },
    {
      "lat": 12.9716,
      "lng": 77.5946,
      "weight": 1.0,
      "crime_type": "theft"
    },
    {
      "lat": 12.9716,
      "lng": 77.5946,
      "weight": 1.0,
      "crime_type": "theft"
    },
    {
      "lat": 12.9716,
      "lng": 77.5946,
      "weight": 1.0,
      "crime_type": "theft"
    },
    {
      "lat": 12.9716,
      "lng": 77.5946,
      "weight": 1.0,
      "crime_type": "theft"
    },
    {
      "lat": 12.9716,
      "lng": 77.5946,
      "weight": 1.0,
      "crime_type": "theft"
    },
    {
      "lat": 12.9716,
      "lng": 77.5946,
      "weight": 1.0,
      "crime_type": "theft"
    },
    {
      "lat": 12.9716,
      "lng": 77.5946,
      "weight": 1.0,
      "crime_type": "theft"
    },
    {
      "lat": 12.9716,
      "lng": 77.5946,
      "weight": 1.0,
      "crime_type": "theft"
    },
    {
      "lat": 12.9716,
      "lng": 77.5946,
      "weight": 1.0,
      "crime_type": "theft"
    },
    {
      "lat": 12.9716,
      "lng": 77.5946,
      "weight": 1.0,
      "crime_type": "theft"
    },
    {
      "lat": 12.9716,
      "lng": 77.5946,
      "weight": 1.0,
      "crime_type": "theft"
    },
    {
      "lat": 12.9716,
      "lng": 77.5946,
      "weight": 1.0,
      "crime_type": "theft"
    },
    {
      "lat": 12.9716,
      "lng": 77.5946,
      "weight": 1.0,
      "crime_type": "theft"
    },
    {
      "lat": 12.9716,
      "lng": 77.5946,
      "weight": 1.0,
      "crime_type": "theft"
    },
    {
      "lat": 12.9716,
      "lng": 77.5946,
      "weight": 1.0,
      "crime_type": "theft"
    },
    {
      "lat": 12.9716,
      "lng": 77.5946,
      "weight": 1.0,
      "crime_type": "theft"
    },
    {
      "lat": 12.9716,
      "lng": 77.5946,
      "weight": 1.0,
      "crime_type": "theft"
    },
    {
      "lat": 12.9716,
      "lng": 77.5946,
      "weight": 1.0,
      "crime_type": "theft"
    }
  ]
}
  ```
  </details>
---

### tests/test_geo.py::test_get_hotspots
**Status:** PASS
**Test Duration:** 0.01s
#### API Requests
- **1. POST http://testserver/api/v1/auth/login** 
  - Status Code: 200
  - Execution Time: 386.91 ms
  - Response Size: 647 bytes
  <details><summary>Payload</summary>
  ```json
  {
  "badge_no": "ADMIN001",
  "password": "Admin@123"
}
  ```
  </details>
  <details><summary>Response</summary>
  ```json
  {
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmYTM3MGUxNS05YjE2LTQ3OTUtYTA3Ni1jYmY5OGYwZTJhY2UiLCJ0eXBlIjoiYWNjZXNzIiwiaWF0IjoxNzg0MDQzMDgzLCJleHAiOjE3ODQwNDY2ODMsInJvbGUiOiJhZG1pbiJ9.3LCsAFPGKxjjMG8H1f5yqWZg6W5QbRUXeoYiQpiO4YM",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmYTM3MGUxNS05YjE2LTQ3OTUtYTA3Ni1jYmY5OGYwZTJhY2UiLCJ0eXBlIjoicmVmcmVzaCIsImlhdCI6MTc4NDA0MzA4MywiZXhwIjoxNzg0NjQ3ODgzfQ.W509c3OVJ1ePDUsGMRUZZhUqp1TvL1vZ2YCL0afDi90",
  "token_type": "bearer",
  "user": {
    "id": "fa370e15-9b16-4795-a076-cbf98f0e2ace",
    "name": "System Admin",
    "badge_no": "ADMIN001",
    "role": "admin",
    "is_active": true,
    "station_id": null
  }
}
  ```
  </details>
- **2. GET http://testserver/api/v1/geo/hotspots** 
  - Status Code: 200
  - Execution Time: 10.96 ms
  - Response Size: 7042 bytes
  <details><summary>Response</summary>
  ```json
  [
  {
    "id": "9a6c3b86-2948-49a6-8161-226aed683044",
    "district_id": "e4846dc4-b95b-4f6d-9614-7b2974bed954",
    "name": "Dharwad Cluster 5",
    "radius_m": 3007.150975697286,
    "crime_density": 147,
    "time_window": "30d",
    "severity": "high",
    "centroid": {
      "lat": 14.726065341572223,
      "lng": 75.93554430301839
    }
  },
  {
    "id": "6b746062-5bc9-4612-ad3d-cd5dcc9e7b9f",
    "district_id": "78fde344-43b4-4191-8aa6-53d893e72fa7",
    "name": "Kalaburagi Cluster 20",
    "radius_m": 2372.6589876166468,
    "crime_density": 141,
    "time_window": "30d",
    "severity": "medium",
    "centroid": {
      "lat": 18.461973177779466,
      "lng": 75.30893156040027
    }
  },
  {
    "id": "5a436ded-158b-4244-96e2-3c4b5a674824",
    "district_id": "ef61a4f4-2fd5-4116-bea5-7fc2838d4b2c",
    "name": "Dakshina Kannada Cluster 8",
    "radius_m": 4721.084626407972,
    "crime_density": 141,
    "time_window": "30d",
    "severity": "critical",
    "centroid": {
      "lat": 16.907450261778155,
      "lng": 77.16716685479167
    }
  },
  {
    "id": "eeed3695-e5cf-4ad3-b44f-ebe11333f5d9",
    "district_id": "920cfca7-4717-4546-95ad-5f295be019bf",
    "name": "Bengaluru Urban Cluster 11",
    "radius_m": 2990.9498860362364,
    "crime_density": 140,
    "time_window": "30d",
    "severity": "critical",
    "centroid": {
      "lat": 17.84665246382847,
      "lng": 77.44834979362156
    }
  },
  {
    "id": "48e11b03-8854-431c-be39-0c03f989308f",
    "district_id": "e4846dc4-b95b-4f6d-9614-7b2974bed954",
    "name": "Dharwad Cluster 16",
    "radius_m": 3413.411135730213,
    "crime_density": 120,
    "time_window": "30d",
    "severity": "critical",
    "centroid": {
      "lat": 16.65090912724431,
      "lng": 75.9714207433757
    }
  },
  {
    "id": "7db22cd5-33a0-437a-aff6-6f1a5981c366",
    "district_id": "920cfca7-4717-4546-95ad-5f295be019bf",
    "name": "Bengaluru Urban Cluster 4",
    "radius_m": 4005.6030642222095,
    "crime_density": 116,
    "time_window": "30d",
    "severity": "medium",
    "centroid": {
      "lat": 14.832459873912924,
      "lng": 76.99541626317222
    }
  },
  {
    "id": "a31c2614-4ca3-4396-bad3-86b43c953d7e",
    "district_id": "920cfca7-4717-4546-95ad-5f295be019bf",
    "name": "Bengaluru Urban Cluster 3",
    "radius_m": 3896.071640321109,
    "crime_density": 115,
    "time_window": "30d",
    "severity": "critical",
    "centroid": {
      "lat": 16.354640207424957,
      "lng": 77.08090275172826
    }
  },
  {
    "id": "51d1e07c-b2b8-44e0-935e-6e512db0297e",
    "district_id": "78fde344-43b4-4191-8aa6-53d893e72fa7",
    "name": "Kalaburagi Cluster 21",
    "radius_m": 4539.716082532905,
    "crime_density": 113,
    "time_window": "30d",
    "severity": "low",
    "centroid": {
      "lat": 13.98401373575671,
      "lng": 74.94872042597075
    }
  },
  {
    "id": "febb22ed-9eba-4742-9934-7c7414098c32",
    "district_id": "920cfca7-4717-4546-95ad-5f295be019bf",
    "name": "Bengaluru Urban Cluster 17",
    "radius_m": 4372.43742075097,
    "crime_density": 111,
    "time_window": "30d",
    "severity": "medium",
    "centroid": {
      "lat": 17.038560121329574,
      "lng": 76.89352169914254
    }
  },
  {
    "id": "35b1792e-260c-4b5e-a981-5d12ffdb869b",
    "district_id": "b7d572b4-bc49-4422-87aa-53b216f50e39",
    "name": "Mysuru Cluster 0",
    "radius_m": 1087.9426469548985,
    "crime_density": 107,
    "time_window": "30d",
    "severity": "high",
    "centroid": {
      "lat": 12.378171808739758,
      "lng": 76.47788860108369
    }
  },
  {
    "id": "ec175f55-5ef0-41c6-89ad-4e5bdcf1c992",
    "district_id": "920cfca7-4717-4546-95ad-5f295be019bf",
    "name": "Bengaluru Urban Cluster 22",
    "radius_m": 1872.7066944569424,
    "crime_density": 96,
    "time_window": "30d",
    "severity": "critical",
    "centroid": {
      "lat": 17.511771950850527,
      "lng": 74.40357168246882
    }
  },
  {
    "id": "dd6b220f-0b2a-4299-8647-e3c3991c87e8",
    "district_id": "ef61a4f4-2fd5-4116-bea5-7fc2838d4b2c",
    "name": "Dakshina Kannada Cluster 1",
    "radius_m": 1679.4907344242022,
    "crime_density": 72,
    "time_window": "30d",
    "severity": "critical",
    "centroid": {
      "lat": 15.122299424378706,
      "lng": 77.81434962791062
    }
  },
  {
    "id": "2d3f407d-cdf2-46bd-aa2a-ee20959901b7",
    "district_id": "78fde344-43b4-4191-8aa6-53d893e72fa7",
    "name": "Kalaburagi Cluster 19",
    "radius_m": 1488.6733487568936,
    "crime_density": 47,
    "time_window": "30d",
    "severity": "medium",
    "centroid": {
      "lat": 12.43461448994053,
      "lng": 74.75905909898617
    }
  },
  {
    "id": "01f60066-aa11-4d40-b00a-5c024f0527b1",
    "district_id": "ef61a4f4-2fd5-4116-bea5-7fc2838d4b2c",
    "name": "Dakshina Kannada Cluster 23",
    "radius_m": 2770.228564615137,
    "crime_density": 41,
    "time_window": "30d",
    "severity": "low",
    "centroid": {
      "lat": 14.098575242278017,
      "lng": 78.01208981871171
    }
  },
  {
    "id": "4953ea8b-5cd1-4e0a-9321-4dc6fc3d6955",
    "district_id": "78fde344-43b4-4191-8aa6-53d893e72fa7",
    "name": "Kalaburagi Cluster 14",
    "radius_m": 2125.3867696420807,
    "crime_density": 39,
    "time_window": "30d",
    "severity": "critical",
    "centroid": {
      "lat": 15.905471331466543,
      "lng": 74.81253527868878
    }
  },
  {
    "id": "bc8208e2-c58a-4c72-a189-bb24dd0c8c90",
    "district_id": "b7d572b4-bc49-4422-87aa-53b216f50e39",
    "name": "Mysuru Cluster 7",
    "radius_m": 2358.6241618655813,
    "crime_density": 39,
    "time_window": "30d",
    "severity": "high",
    "centroid": {
      "lat": 12.889803412877834,
      "lng": 77.83077270429892
    }
  },
  {
    "id": "7d0f4e18-da23-4edd-a4f8-7f78fb0d37bc",
    "district_id": "b7d572b4-bc49-4422-87aa-53b216f50e39",
    "name": "Mysuru Cluster 6",
    "radius_m": 2811.8498331375395,
    "crime_density": 36,
    "time_window": "30d",
    "severity": "medium",
    "centroid": {
      "lat": 14.84061714111246,
      "lng": 76.65399117178582
    }
  },
  {
    "id": "29340272-00c0-454f-9fbc-235cc3b7a543",
    "district_id": "78fde344-43b4-4191-8aa6-53d893e72fa7",
    "name": "Kalaburagi Cluster 9",
    "radius_m": 1699.615865961242,
    "crime_density": 36,
    "time_window": "30d",
    "severity": "critical",
    "centroid": {
      "lat": 15.280379131409775,
      "lng": 76.9436522490662
    }
  },
  {
    "id": "cd58e282-843f-45a4-998c-dff3e18659eb",
    "district_id": "ef61a4f4-2fd5-4116-bea5-7fc2838d4b2c",
    "name": "Dakshina Kannada Cluster 18",
    "radius_m": 4530.398357767233,
    "crime_density": 35,
    "time_window": "30d",
    "severity": "critical",
    "centroid": {
      "lat": 12.034367883211909,
      "lng": 78.3003452890333
    }
  },
  {
    "id": "9dfc5e8a-6420-401e-94ad-6851aaee57b3",
    "district_id": "78fde344-43b4-4191-8aa6-53d893e72fa7",
    "name": "Kalaburagi Cluster 15",
    "radius_m": 2788.5636322065147,
    "crime_density": 33,
    "time_window": "30d",
    "severity": "low",
    "centroid": {
      "lat": 15.095004286423578,
      "lng": 75.6670306380344
    }
  },
  {
    "id": "3685770a-a581-48c1-bbc7-2978caad1a2d",
    "district_id": "ef61a4f4-2fd5-4116-bea5-7fc2838d4b2c",
    "name": "Dakshina Kannada Cluster 2",
    "radius_m": 1296.894098593786,
    "crime_density": 30,
    "time_window": "30d",
    "severity": "high",
    "centroid": {
      "lat": 17.93755074475023,
      "lng": 76.7185898987601
    }
  },
  {
    "id": "0d79146b-6630-4cb6-9c13-4532b53cb4fe",
    "district_id": "b7d572b4-bc49-4422-87aa-53b216f50e39",
    "name": "Mysuru Cluster 12",
    "radius_m": 2403.3300001602156,
    "crime_density": 26,
    "time_window": "30d",
    "severity": "medium",
    "centroid": {
      "lat": 14.283672088162337,
      "lng": 74.12127104075819
    }
  },
  {
    "id": "d3cc3850-71d1-4822-a59c-85a3f63b241a",
    "district_id": "e4846dc4-b95b-4f6d-9614-7b2974bed954",
    "name": "Dharwad Cluster 13",
    "radius_m": 1541.0534288403533,
    "crime_density": 26,
    "time_window": "30d",
    "severity": "low",
    "centroid": {
      "lat": 14.278293162644399,
      "lng": 78.06117451180147
    }
  },
  {
    "id": "35a52f94-8d02-4727-81f6-6c94bfffd3f5",
    "district_id": "ef61a4f4-2fd5-4116-bea5-7fc2838d4b2c",
    "name": "Dakshina Kannada Cluster 10",
    "radius_m": 1110.6105218550447,
    "crime_density": 25,
    "time_window": "30d",
    "severity": "low",
    "centroid": {
      "lat": 12.512728824423816,
      "lng": 75.56137831407139
    }
  },
  {
    "id": "85fde24f-3a02-48c9-bb62-aecb77e127da",
    "district_id": "ef61a4f4-2fd5-4116-bea5-7fc2838d4b2c",
    "name": "Dakshina Kannada Cluster 24",
    "radius_m": 1678.3114639505877,
    "crime_density": 22,
    "time_window": "30d",
    "severity": "critical",
    "centroid": {
      "lat": 18.00793780594666,
      "lng": 74.48782124041244
    }
  }
]
  ```
  </details>
---

### tests/test_missing_persons.py::test_missing_persons_crud
**Status:** PASS
**Test Duration:** 0.05s
#### API Requests
- **1. POST http://testserver/api/v1/auth/login** 
  - Status Code: 200
  - Execution Time: 415.21 ms
  - Response Size: 647 bytes
  <details><summary>Payload</summary>
  ```json
  {
  "badge_no": "ADMIN001",
  "password": "Admin@123"
}
  ```
  </details>
  <details><summary>Response</summary>
  ```json
  {
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmYTM3MGUxNS05YjE2LTQ3OTUtYTA3Ni1jYmY5OGYwZTJhY2UiLCJ0eXBlIjoiYWNjZXNzIiwiaWF0IjoxNzg0MDQzMDgzLCJleHAiOjE3ODQwNDY2ODMsInJvbGUiOiJhZG1pbiJ9.3LCsAFPGKxjjMG8H1f5yqWZg6W5QbRUXeoYiQpiO4YM",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmYTM3MGUxNS05YjE2LTQ3OTUtYTA3Ni1jYmY5OGYwZTJhY2UiLCJ0eXBlIjoicmVmcmVzaCIsImlhdCI6MTc4NDA0MzA4MywiZXhwIjoxNzg0NjQ3ODgzfQ.W509c3OVJ1ePDUsGMRUZZhUqp1TvL1vZ2YCL0afDi90",
  "token_type": "bearer",
  "user": {
    "id": "fa370e15-9b16-4795-a076-cbf98f0e2ace",
    "name": "System Admin",
    "badge_no": "ADMIN001",
    "role": "admin",
    "is_active": true,
    "station_id": null
  }
}
  ```
  </details>
- **2. POST http://testserver/api/v1/missing-persons** 
  - Status Code: 201
  - Execution Time: 14.83 ms
  - Response Size: 184 bytes
  <details><summary>Payload</summary>
  ```json
  {
  "name_hash": "hash_d66ec29e",
  "age": 30,
  "last_seen_date": "2026-07-14",
  "last_seen_location": {
    "lat": 12.9,
    "lng": 77.5
  },
  "last_seen_address": "MG Road"
}
  ```
  </details>
  <details><summary>Response</summary>
  ```json
  {
  "id": "424a8d0a-1cd0-475b-b00f-ecba38547aa3",
  "name_hash": "hash_d66ec29e",
  "age": 30,
  "last_seen_address": "MG Road",
  "last_seen_date": "2026-07-14",
  "status": "reported",
  "matched_fir_id": null
}
  ```
  </details>
- **3. GET http://testserver/api/v1/missing-persons** 
  - Status Code: 200
  - Execution Time: 11.26 ms
  - Response Size: 12821 bytes
  <details><summary>Response</summary>
  ```json
  [
  {
    "id": "c10d55f4-67c2-404b-81c7-95b22b37958f",
    "name_hash": "string",
    "age": 130,
    "last_seen_address": "string",
    "last_seen_date": "2026-07-14",
    "status": "reported",
    "matched_fir_id": null
  },
  {
    "id": "424a8d0a-1cd0-475b-b00f-ecba38547aa3",
    "name_hash": "hash_d66ec29e",
    "age": 30,
    "last_seen_address": "MG Road",
    "last_seen_date": "2026-07-14",
    "status": "reported",
    "matched_fir_id": null
  },
  {
    "id": "4027213a-e6fd-49a9-9291-12619f09868f",
    "name_hash": "hash_5e3b1ac2",
    "age": 30,
    "last_seen_address": "MG Road",
    "last_seen_date": "2026-07-14",
    "status": "reported",
    "matched_fir_id": null
  },
  {
    "id": "7d2916d8-6084-4c7a-ab53-ef8f5e7bbd33",
    "name_hash": "hash_64081bbc",
    "age": 30,
    "last_seen_address": "MG Road",
    "last_seen_date": "2026-07-14",
    "status": "reported",
    "matched_fir_id": null
  },
  {
    "id": "bc430670-07bb-44b3-857f-9278ac75d79a",
    "name_hash": "hash_e9143a14",
    "age": 30,
    "last_seen_address": "MG Road",
    "last_seen_date": "2026-07-14",
    "status": "reported",
    "matched_fir_id": null
  },
  {
    "id": "6552229a-a7a2-4535-8d8e-22ac5653adf1",
    "name_hash": "hash_b53aca04",
    "age": 30,
    "last_seen_address": "MG Road",
    "last_seen_date": "2026-07-14",
    "status": "reported",
    "matched_fir_id": null
  },
  {
    "id": "a6f40591-58ca-4bbe-9508-a678de245524",
    "name_hash": "hash_deb03fa0",
    "age": 30,
    "last_seen_address": "MG Road",
    "last_seen_date": "2026-07-14",
    "status": "reported",
    "matched_fir_id": null
  },
  {
    "id": "637aef80-79e4-4944-a607-de4ffd539233",
    "name_hash": "hash_547e5665",
    "age": 30,
    "last_seen_address": "MG Road",
    "last_seen_date": "2026-07-14",
    "status": "reported",
    "matched_fir_id": null
  },
  {
    "id": "5d6600d8-f703-4056-a386-0a3e346bebdb",
    "name_hash": "hash_b31703a9",
    "age": 30,
    "last_seen_address": "MG Road",
    "last_seen_date": "2026-07-14",
    "status": "reported",
    "matched_fir_id": null
  },
  {
    "id": "094402a2-9cfe-4d03-8556-a6c80a855026",
    "name_hash": "hash_4592f24d",
    "age": 30,
    "last_seen_address": "MG Road",
    "last_seen_date": "2026-07-14",
    "status": "reported",
    "matched_fir_id": null
  },
  {
    "id": "d350e2df-681d-4d96-8179-eb9214fafb37",
    "name_hash": "hash_59925617",
    "age": 30,
    "last_seen_address": "MG Road",
    "last_seen_date": "2026-07-14",
    "status": "reported",
    "matched_fir_id": null
  },
  {
    "id": "b76e9f5e-82ee-44c4-81e4-f446b7709109",
    "name_hash": "hash_f6de3736",
    "age": 30,
    "last_seen_address": "MG Road",
    "last_seen_date": "2026-07-14",
    "status": "reported",
    "matched_fir_id": null
  },
  {
    "id": "bd2d153b-560f-4a36-838c-efb58927b61a",
    "name_hash": "hash_6dc7b365",
    "age": 30,
    "last_seen_address": "MG Road",
    "last_seen_date": "2026-07-14",
    "status": "reported",
    "matched_fir_id": null
  },
  {
    "id": "498899b4-c99f-48bd-8257-4759ed9068cb",
    "name_hash": "hash_e8f503e4",
    "age": 30,
    "last_seen_address": "MG Road",
    "last_seen_date": "2026-07-14",
    "status": "reported",
    "matched_fir_id": null
  },
  {
    "id": "724b1201-82af-4bb2-81cb-db08069f74df",
    "name_hash": "hash_person_42",
    "age": 51,
    "last_seen_address": "Sample Address, Karnataka",
    "last_seen_date": "2026-07-13",
    "status": "matched",
    "matched_fir_id": null
  },
  {
    "id": "7a904d81-52fe-4f1b-9a19-55c3aeb49c0c",
    "name_hash": "hash_person_9",
    "age": 57,
    "last_seen_address": "Sample Address, Karnataka",
    "last_seen_date": "2026-07-12",
    "status": "active_search",
    "matched_fir_id": null
  },
  {
    "id": "38313704-0c3a-4ca6-b623-04b0d26c35a0",
    "name_hash": "hash_person_5",
    "age": 32,
    "last_seen_address": "Sample Address, Karnataka",
    "last_seen_date": "2026-07-12",
    "status": "closed",
    "matched_fir_id": null
  },
  {
    "id": "8354bd43-21b8-4d5e-a4c8-92e3daf461a7",
    "name_hash": "hash_person_6",
    "age": 71,
    "last_seen_address": "Sample Address, Karnataka",
    "last_seen_date": "2026-07-11",
    "status": "active_search",
    "matched_fir_id": null
  },
  {
    "id": "c12651f7-86a9-40cc-b6a2-8440691a07d6",
    "name_hash": "hash_person_40",
    "age": 54,
    "last_seen_address": "Sample Address, Karnataka",
    "last_seen_date": "2026-07-08",
    "status": "closed",
    "matched_fir_id": null
  },
  {
    "id": "69f986b9-533a-4503-91da-11c9b51dcc1b",
    "name_hash": "hash_person_25",
    "age": 81,
    "last_seen_address": "Sample Address, Karnataka",
    "last_seen_date": "2026-07-05",
    "status": "closed",
    "matched_fir_id": null
  },
  {
    "id": "18130197-eb8d-465c-8df7-da29766628ef",
    "name_hash": "hash_person_27",
    "age": 20,
    "last_seen_address": "Sample Address, Karnataka",
    "last_seen_date": "2026-06-26",
    "status": "matched",
    "matched_fir_id": null
  },
  {
    "id": "fdcafd2f-48d6-4730-b672-be05341234eb",
    "name_hash": "hash_person_48",
    "age": 37,
    "last_seen_address": "Sample Address, Karnataka",
    "last_seen_date": "2026-06-20",
    "status": "closed",
    "matched_fir_id": null
  },
  {
    "id": "f3624412-d752-481d-ac72-5fb4995fab65",
    "name_hash": "hash_person_1",
    "age": 12,
    "last_seen_address": "Sample Address, Karnataka",
    "last_seen_date": "2026-06-19",
    "status": "active_search",
    "matched_fir_id": null
  },
  {
    "id": "1f2b60b5-7feb-46d6-985f-a45f941fb5db",
    "name_hash": "hash_person_17",
    "age": 54,
    "last_seen_address": "Sample Address, Karnataka",
    "last_seen_date": "2026-06-16",
    "status": "matched",
    "matched_fir_id": null
  },
  {
    "id": "21855e3c-5cc7-4332-8637-a94553ca1353",
    "name_hash": "hash_person_11",
    "age": 36,
    "last_seen_address": "Sample Address, Karnataka",
    "last_seen_date": "2026-06-11",
    "status": "active_search",
    "matched_fir_id": null
  },
  {
    "id": "6e0711fb-057b-40f1-832c-95766d610de1",
    "name_hash": "hash_person_28",
    "age": 77,
    "last_seen_address": "Sample Address, Karnataka",
    "last_seen_date": "2026-06-08",
    "status": "reported",
    "matched_fir_id": null
  },
  {
    "id": "55a5fd92-c3d8-4e56-8d93-4ae7f6c70571",
    "name_hash": "hash_person_10",
    "age": 13,
    "last_seen_address": "Sample Address, Karnataka",
    "last_seen_date": "2026-06-07",
    "status": "reported",
    "matched_fir_id": null
  },
  {
    "id": "6bda5f01-feb3-4ba2-8878-ee949f2463e2",
    "name_hash": "hash_person_16",
    "age": 23,
    "last_seen_address": "Sample Address, Karnataka",
    "last_seen_date": "2026-06-07",
    "status": "closed",
    "matched_fir_id": null
  },
  {
    "id": "20313af9-b7ce-4bfc-8484-d140d42b4a01",
    "name_hash": "hash_person_49",
    "age": 21,
    "last_seen_address": "Sample Address, Karnataka",
    "last_seen_date": "2026-06-06",
    "status": "matched",
    "matched_fir_id": null
  },
  {
    "id": "d791bad5-7170-4b36-83cd-54857ff88700",
    "name_hash": "hash_person_36",
    "age": 65,
    "last_seen_address": "Sample Address, Karnataka",
    "last_seen_date": "2026-06-04",
    "status": "active_search",
    "matched_fir_id": null
  },
  {
    "id": "7543d1ab-c133-4839-9f3c-578f837f2571",
    "name_hash": "hash_person_38",
    "age": 47,
    "last_seen_address": "Sample Address, Karnataka",
    "last_seen_date": "2026-06-01",
    "status": "reported",
    "matched_fir_id": null
  },
  {
    "id": "4753d2b9-ffa2-405c-aad3-a62060e3d17e",
    "name_hash": "hash_person_31",
    "age": 34,
    "last_seen_address": "Sample Address, Karnataka",
    "last_seen_date": "2026-05-31",
    "status": "reported",
    "matched_fir_id": null
  },
  {
    "id": "d4143748-4573-42f8-843c-2cf78aba52d9",
    "name_hash": "hash_person_37",
    "age": 60,
    "last_seen_address": "Sample Address, Karnataka",
    "last_seen_date": "2026-05-29",
    "status": "active_search",
    "matched_fir_id": null
  },
  {
    "id": "8bc05a91-100f-4f0a-98aa-1de3d3bc04c6",
    "name_hash": "hash_person_13",
    "age": 21,
    "last_seen_address": "Sample Address, Karnataka",
    "last_seen_date": "2026-05-28",
    "status": "active_search",
    "matched_fir_id": null
  },
  {
    "id": "a7710916-90f4-4483-9eef-64e93203a327",
    "name_hash": "hash_person_19",
    "age": 72,
    "last_seen_address": "Sample Address, Karnataka",
    "last_seen_date": "2026-05-28",
    "status": "reported",
    "matched_fir_id": null
  },
  {
    "id": "d6283d5c-a6f4-4dc8-9c4d-eb7af420a646",
    "name_hash": "hash_person_2",
    "age": 16,
    "last_seen_address": "Sample Address, Karnataka",
    "last_seen_date": "2026-05-23",
    "status": "closed",
    "matched_fir_id": null
  },
  {
    "id": "534076a1-be5a-43a3-9864-934839a25467",
    "name_hash": "hash_person_12",
    "age": 82,
    "last_seen_address": "Sample Address, Karnataka",
    "last_seen_date": "2026-05-21",
    "status": "closed",
    "matched_fir_id": null
  },
  {
    "id": "3fc09238-f5f6-4073-b150-71a194b653bb",
    "name_hash": "hash_person_0",
    "age": 72,
    "last_seen_address": "Sample Address, Karnataka",
    "last_seen_date": "2026-05-20",
    "status": "active_search",
    "matched_fir_id": null
  },
  {
    "id": "bc8779c0-4ac5-4ca8-83fe-075f29a632f0",
    "name_hash": "hash_person_44",
    "age": 15,
    "last_seen_address": "Sample Address, Karnataka",
    "last_seen_date": "2026-05-19",
    "status": "reported",
    "matched_fir_id": null
  },
  {
    "id": "05f618fc-8043-4c6a-ab68-eac81f6583d9",
    "name_hash": "hash_person_47",
    "age": 69,
    "last_seen_address": "Sample Address, Karnataka",
    "last_seen_date": "2026-05-19",
    "status": "closed",
    "matched_fir_id": null
  },
  {
    "id": "6a64f545-5b7e-40c7-9c19-3cf15f4e9310",
    "name_hash": "hash_person_35",
    "age": 48,
    "last_seen_address": "Sample Address, Karnataka",
    "last_seen_date": "2026-05-18",
    "status": "reported",
    "matched_fir_id": null
  },
  {
    "id": "f1342c7c-beda-4adb-bbaa-1a39d809a5c1",
    "name_hash": "hash_person_4",
    "age": 56,
    "last_seen_address": "Sample Address, Karnataka",
    "last_seen_date": "2026-05-16",
    "status": "closed",
    "matched_fir_id": null
  },
  {
    "id": "76afe83a-e72f-4ee7-8979-0217bf50da9b",
    "name_hash": "hash_person_8",
    "age": 30,
    "last_seen_address": "Sample Address, Karnataka",
    "last_seen_date": "2026-05-14",
    "status": "closed",
    "matched_fir_id": null
  },
  {
    "id": "4e270474-9c8c-4f98-9315-57323a6869ad",
    "name_hash": "hash_person_32",
    "age": 56,
    "last_seen_address": "Sample Address, Karnataka",
    "last_seen_date": "2026-05-12",
    "status": "active_search",
    "matched_fir_id": null
  },
  {
    "id": "59b5e823-8bf8-45b3-be8c-9feb81eba872",
    "name_hash": "hash_person_45",
    "age": 33,
    "last_seen_address": "Sample Address, Karnataka",
    "last_seen_date": "2026-05-09",
    "status": "closed",
    "matched_fir_id": null
  },
  {
    "id": "1656647b-599c-4b15-9063-1f5568a69d39",
    "name_hash": "hash_person_29",
    "age": 54,
    "last_seen_address": "Sample Address, Karnataka",
    "last_seen_date": "2026-05-09",
    "status": "reported",
    "matched_fir_id": null
  },
  {
    "id": "744c906f-ef80-4ae5-b45e-bbaae1ec87c7",
    "name_hash": "hash_person_3",
    "age": 76,
    "last_seen_address": "Sample Address, Karnataka",
    "last_seen_date": "2026-05-08",
    "status": "active_search",
    "matched_fir_id": null
  },
  {
    "id": "82e772c3-5131-45ab-894b-6aba66410c3e",
    "name_hash": "hash_person_23",
    "age": 69,
    "last_seen_address": "Sample Address, Karnataka",
    "last_seen_date": "2026-05-08",
    "status": "active_search",
    "matched_fir_id": null
  },
  {
    "id": "c8f2dd32-49dd-45a6-838c-f22ec2709a2e",
    "name_hash": "hash_person_20",
    "age": 60,
    "last_seen_address": "Sample Address, Karnataka",
    "last_seen_date": "2026-05-08",
    "status": "closed",
    "matched_fir_id": null
  },
  {
    "id": "5aa82552-130b-42bd-92ae-98b454eae146",
    "name_hash": "hash_person_14",
    "age": 68,
    "last_seen_address": "Sample Address, Karnataka",
    "last_seen_date": "2026-05-04",
    "status": "active_search",
    "matched_fir_id": null
  },
  {
    "id": "71d025cf-2d55-4217-abfa-73509b7d2a9b",
    "name_hash": "hash_person_43",
    "age": 64,
    "last_seen_address": "Sample Address, Karnataka",
    "last_seen_date": "2026-05-01",
    "status": "matched",
    "matched_fir_id": null
  },
  {
    "id": "96006e3a-d6c0-445d-9288-d426ba15c31f",
    "name_hash": "hash_person_26",
    "age": 10,
    "last_seen_address": "Sample Address, Karnataka",
    "last_seen_date": "2026-04-27",
    "status": "active_search",
    "matched_fir_id": null
  },
  {
    "id": "9d64ea1f-8000-4b64-9ef9-d4a2c287b16f",
    "name_hash": "hash_person_33",
    "age": 28,
    "last_seen_address": "Sample Address, Karnataka",
    "last_seen_date": "2026-04-27",
    "status": "matched",
    "matched_fir_id": null
  },
  {
    "id": "1fc5636b-5358-4d51-95a4-d329b083b233",
    "name_hash": "hash_person_18",
    "age": 85,
    "last_seen_address": "Sample Address, Karnataka",
    "last_seen_date": "2026-04-26",
    "status": "matched",
    "matched_fir_id": null
  },
  {
    "id": "d5bc8fc0-a86c-4728-b0f3-4323f3e5796d",
    "name_hash": "hash_person_34",
    "age": 8,
    "last_seen_address": "Sample Address, Karnataka",
    "last_seen_date": "2026-04-22",
    "status": "active_search",
    "matched_fir_id": null
  },
  {
    "id": "06f461f5-768c-4961-adf4-41f54df59f2f",
    "name_hash": "hash_person_46",
    "age": 32,
    "last_seen_address": "Sample Address, Karnataka",
    "last_seen_date": "2026-04-19",
    "status": "closed",
    "matched_fir_id": null
  },
  {
    "id": "ce34b210-fefb-4a04-bad4-c406002d7e3c",
    "name_hash": "hash_person_39",
    "age": 60,
    "last_seen_address": "Sample Address, Karnataka",
    "last_seen_date": "2026-04-18",
    "status": "matched",
    "matched_fir_id": null
  },
  {
    "id": "32889baf-1e72-44c7-9475-749d98a09994",
    "name_hash": "hash_person_15",
    "age": 57,
    "last_seen_address": "Sample Address, Karnataka",
    "last_seen_date": "2026-04-18",
    "status": "active_search",
    "matched_fir_id": null
  },
  {
    "id": "7e603d53-c499-4528-ad25-702a3fdfaaa5",
    "name_hash": "hash_person_22",
    "age": 43,
    "last_seen_address": "Sample Address, Karnataka",
    "last_seen_date": "2026-04-16",
    "status": "matched",
    "matched_fir_id": null
  },
  {
    "id": "d9588643-9386-4772-8f07-8d2f994ec916",
    "name_hash": "hash_person_41",
    "age": 52,
    "last_seen_address": "Sample Address, Karnataka",
    "last_seen_date": "2026-04-15",
    "status": "reported",
    "matched_fir_id": null
  },
  {
    "id": "7b6bffad-6710-49e0-967a-35fdbbe02bff",
    "name_hash": "hash_person_30",
    "age": 56,
    "last_seen_address": "Sample Address, Karnataka",
    "last_seen_date": "2026-04-15",
    "status": "active_search",
    "matched_fir_id": null
  },
  {
    "id": "dc1cb946-6eed-438c-b9f4-353dcda1c030",
    "name_hash": "hash_person_21",
    "age": 80,
    "last_seen_address": "Sample Address, Karnataka",
    "last_seen_date": "2026-04-12",
    "status": "closed",
    "matched_fir_id": null
  },
  {
    "id": "67b2a97b-61e6-4ce9-abe3-e017409f1665",
    "name_hash": "hash_person_7",
    "age": 76,
    "last_seen_address": "Sample Address, Karnataka",
    "last_seen_date": "2026-04-10",
    "status": "active_search",
    "matched_fir_id": null
  },
  {
    "id": "e9a40683-9ceb-4f64-9011-e240b4982300",
    "name_hash": "hash_person_24",
    "age": 70,
    "last_seen_address": "Sample Address, Karnataka",
    "last_seen_date": "2026-04-09",
    "status": "reported",
    "matched_fir_id": null
  }
]
  ```
  </details>
- **4. GET http://testserver/api/v1/missing-persons/424a8d0a-1cd0-475b-b00f-ecba38547aa3** 
  - Status Code: 200
  - Execution Time: 9.61 ms
  - Response Size: 184 bytes
  <details><summary>Response</summary>
  ```json
  {
  "id": "424a8d0a-1cd0-475b-b00f-ecba38547aa3",
  "name_hash": "hash_d66ec29e",
  "age": 30,
  "last_seen_address": "MG Road",
  "last_seen_date": "2026-07-14",
  "status": "reported",
  "matched_fir_id": null
}
  ```
  </details>
- **5. GET http://testserver/api/v1/missing-persons/424a8d0a-1cd0-475b-b00f-ecba38547aa3/matches** 
  - Status Code: 200
  - Execution Time: 15.71 ms
  - Response Size: 76 bytes
  <details><summary>Response</summary>
  ```json
  {
  "missing_person_id": "424a8d0a-1cd0-475b-b00f-ecba38547aa3",
  "candidates": []
}
  ```
  </details>
---

### tests/test_missing_persons.py::test_missing_persons_invalid_payload
**Status:** PASS
**Test Duration:** 0.01s
#### API Requests
- **1. POST http://testserver/api/v1/auth/login** 
  - Status Code: 200
  - Execution Time: 446.04 ms
  - Response Size: 647 bytes
  <details><summary>Payload</summary>
  ```json
  {
  "badge_no": "ADMIN001",
  "password": "Admin@123"
}
  ```
  </details>
  <details><summary>Response</summary>
  ```json
  {
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmYTM3MGUxNS05YjE2LTQ3OTUtYTA3Ni1jYmY5OGYwZTJhY2UiLCJ0eXBlIjoiYWNjZXNzIiwiaWF0IjoxNzg0MDQzMDg0LCJleHAiOjE3ODQwNDY2ODQsInJvbGUiOiJhZG1pbiJ9.sT0AyDGCZmxmhSY3uP-xUhKblS9H3VaH_5EK9h-CZY8",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmYTM3MGUxNS05YjE2LTQ3OTUtYTA3Ni1jYmY5OGYwZTJhY2UiLCJ0eXBlIjoicmVmcmVzaCIsImlhdCI6MTc4NDA0MzA4NCwiZXhwIjoxNzg0NjQ3ODg0fQ.NWUM1OVj2_XAL6aNuVf9oE0qH4FHUzIz0Lbm28WTTCo",
  "token_type": "bearer",
  "user": {
    "id": "fa370e15-9b16-4795-a076-cbf98f0e2ace",
    "name": "System Admin",
    "badge_no": "ADMIN001",
    "role": "admin",
    "is_active": true,
    "station_id": null
  }
}
  ```
  </details>
- **2. POST http://testserver/api/v1/missing-persons** 
  - Status Code: 422
  - Execution Time: 5.03 ms
  - Response Size: 257 bytes
  <details><summary>Payload</summary>
  ```json
  {
  "age": 30,
  "last_seen_date": "2026-07-14"
}
  ```
  </details>
  <details><summary>Response</summary>
  ```json
  {
  "detail": [
    {
      "type": "missing",
      "loc": [
        "body",
        "name_hash"
      ],
      "msg": "Field required",
      "input": {
        "age": 30,
        "last_seen_date": "2026-07-14"
      }
    },
    {
      "type": "missing",
      "loc": [
        "body",
        "last_seen_location"
      ],
      "msg": "Field required",
      "input": {
        "age": 30,
        "last_seen_date": "2026-07-14"
      }
    }
  ]
}
  ```
  </details>
---

### tests/test_missing_persons.py::test_missing_persons_nonexistent_id
**Status:** PASS
**Test Duration:** 0.01s
#### API Requests
- **1. POST http://testserver/api/v1/auth/login** 
  - Status Code: 200
  - Execution Time: 475.68 ms
  - Response Size: 647 bytes
  <details><summary>Payload</summary>
  ```json
  {
  "badge_no": "ADMIN001",
  "password": "Admin@123"
}
  ```
  </details>
  <details><summary>Response</summary>
  ```json
  {
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmYTM3MGUxNS05YjE2LTQ3OTUtYTA3Ni1jYmY5OGYwZTJhY2UiLCJ0eXBlIjoiYWNjZXNzIiwiaWF0IjoxNzg0MDQzMDg0LCJleHAiOjE3ODQwNDY2ODQsInJvbGUiOiJhZG1pbiJ9.sT0AyDGCZmxmhSY3uP-xUhKblS9H3VaH_5EK9h-CZY8",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmYTM3MGUxNS05YjE2LTQ3OTUtYTA3Ni1jYmY5OGYwZTJhY2UiLCJ0eXBlIjoicmVmcmVzaCIsImlhdCI6MTc4NDA0MzA4NCwiZXhwIjoxNzg0NjQ3ODg0fQ.NWUM1OVj2_XAL6aNuVf9oE0qH4FHUzIz0Lbm28WTTCo",
  "token_type": "bearer",
  "user": {
    "id": "fa370e15-9b16-4795-a076-cbf98f0e2ace",
    "name": "System Admin",
    "badge_no": "ADMIN001",
    "role": "admin",
    "is_active": true,
    "station_id": null
  }
}
  ```
  </details>
- **2. GET http://testserver/api/v1/missing-persons/d3861ebc-e8a0-4159-a119-f87c760eeb57** 
  - Status Code: 404
  - Execution Time: 5.46 ms
  - Response Size: 75 bytes
  <details><summary>Response</summary>
  ```json
  {
  "detail": "Missing person d3861ebc-e8a0-4159-a119-f87c760eeb57 not found."
}
  ```
  </details>
---

### tests/test_network.py::test_network_graph
**Status:** PASS
**Test Duration:** 0.01s
#### API Requests
- **1. POST http://testserver/api/v1/auth/login** 
  - Status Code: 200
  - Execution Time: 382.92 ms
  - Response Size: 647 bytes
  <details><summary>Payload</summary>
  ```json
  {
  "badge_no": "ADMIN001",
  "password": "Admin@123"
}
  ```
  </details>
  <details><summary>Response</summary>
  ```json
  {
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmYTM3MGUxNS05YjE2LTQ3OTUtYTA3Ni1jYmY5OGYwZTJhY2UiLCJ0eXBlIjoiYWNjZXNzIiwiaWF0IjoxNzg0MDQzMDg1LCJleHAiOjE3ODQwNDY2ODUsInJvbGUiOiJhZG1pbiJ9.S0vtWKUBtyCD058XHMTHncL-1JMYGiUqyVsRik5plHM",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmYTM3MGUxNS05YjE2LTQ3OTUtYTA3Ni1jYmY5OGYwZTJhY2UiLCJ0eXBlIjoicmVmcmVzaCIsImlhdCI6MTc4NDA0MzA4NSwiZXhwIjoxNzg0NjQ3ODg1fQ._-0karwzg9HyxuTG04Nlh6dGcLREcBi4xeTTTFcJTS8",
  "token_type": "bearer",
  "user": {
    "id": "fa370e15-9b16-4795-a076-cbf98f0e2ace",
    "name": "System Admin",
    "badge_no": "ADMIN001",
    "role": "admin",
    "is_active": true,
    "station_id": null
  }
}
  ```
  </details>
- **2. GET http://testserver/api/v1/network/graph** 
  - Status Code: 200
  - Execution Time: 8.43 ms
  - Response Size: 23 bytes
  <details><summary>Response</summary>
  ```json
  {
  "nodes": [],
  "edges": []
}
  ```
  </details>
---

### tests/test_network.py::test_network_central_nodes
**Status:** PASS
**Test Duration:** 0.01s
#### API Requests
- **1. POST http://testserver/api/v1/auth/login** 
  - Status Code: 200
  - Execution Time: 373.13 ms
  - Response Size: 647 bytes
  <details><summary>Payload</summary>
  ```json
  {
  "badge_no": "ADMIN001",
  "password": "Admin@123"
}
  ```
  </details>
  <details><summary>Response</summary>
  ```json
  {
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmYTM3MGUxNS05YjE2LTQ3OTUtYTA3Ni1jYmY5OGYwZTJhY2UiLCJ0eXBlIjoiYWNjZXNzIiwiaWF0IjoxNzg0MDQzMDg1LCJleHAiOjE3ODQwNDY2ODUsInJvbGUiOiJhZG1pbiJ9.S0vtWKUBtyCD058XHMTHncL-1JMYGiUqyVsRik5plHM",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmYTM3MGUxNS05YjE2LTQ3OTUtYTA3Ni1jYmY5OGYwZTJhY2UiLCJ0eXBlIjoicmVmcmVzaCIsImlhdCI6MTc4NDA0MzA4NSwiZXhwIjoxNzg0NjQ3ODg1fQ._-0karwzg9HyxuTG04Nlh6dGcLREcBi4xeTTTFcJTS8",
  "token_type": "bearer",
  "user": {
    "id": "fa370e15-9b16-4795-a076-cbf98f0e2ace",
    "name": "System Admin",
    "badge_no": "ADMIN001",
    "role": "admin",
    "is_active": true,
    "station_id": null
  }
}
  ```
  </details>
- **2. GET http://testserver/api/v1/network/central-nodes** 
  - Status Code: 200
  - Execution Time: 6.88 ms
  - Response Size: 2 bytes
---

### tests/test_risk.py::test_risk_zone
**Status:** PASS
**Test Duration:** 0.02s
#### API Requests
- **1. POST http://testserver/api/v1/auth/login** 
  - Status Code: 200
  - Execution Time: 477.88 ms
  - Response Size: 647 bytes
  <details><summary>Payload</summary>
  ```json
  {
  "badge_no": "ADMIN001",
  "password": "Admin@123"
}
  ```
  </details>
  <details><summary>Response</summary>
  ```json
  {
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmYTM3MGUxNS05YjE2LTQ3OTUtYTA3Ni1jYmY5OGYwZTJhY2UiLCJ0eXBlIjoiYWNjZXNzIiwiaWF0IjoxNzg0MDQzMDg2LCJleHAiOjE3ODQwNDY2ODYsInJvbGUiOiJhZG1pbiJ9.N3XWuvScE1mNvwg9KHDyokfi9kK_DgGe4pzvqPiOpMA",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmYTM3MGUxNS05YjE2LTQ3OTUtYTA3Ni1jYmY5OGYwZTJhY2UiLCJ0eXBlIjoicmVmcmVzaCIsImlhdCI6MTc4NDA0MzA4NiwiZXhwIjoxNzg0NjQ3ODg2fQ.PUfF1Ak_gZkHodUlilHLk_ENgBIrnP9ZuCN3zScph04",
  "token_type": "bearer",
  "user": {
    "id": "fa370e15-9b16-4795-a076-cbf98f0e2ace",
    "name": "System Admin",
    "badge_no": "ADMIN001",
    "role": "admin",
    "is_active": true,
    "station_id": null
  }
}
  ```
  </details>
- **2. GET http://testserver/api/v1/geo/districts** 
  - Status Code: 200
  - Execution Time: 7.34 ms
  - Response Size: 2981 bytes
  <details><summary>Response</summary>
  ```json
  [
  {
    "id": "01036fbe-c25c-4336-9014-edb51277c675",
    "name": "Bagalkot",
    "state": null,
    "population": null
  },
  {
    "id": "b6913b52-bfb3-4c89-b143-c7cf74c5bacf",
    "name": "Ballari",
    "state": null,
    "population": null
  },
  {
    "id": "c1484fd7-7f7a-476e-ba4a-2684448d7fbc",
    "name": "Belagavi",
    "state": null,
    "population": null
  },
  {
    "id": "e0328f8b-68a2-45c6-9e8e-195cb16c0b36",
    "name": "Bengaluru Rural",
    "state": null,
    "population": null
  },
  {
    "id": "920cfca7-4717-4546-95ad-5f295be019bf",
    "name": "Bengaluru Urban",
    "state": null,
    "population": null
  },
  {
    "id": "9dafcebe-47f5-4da7-a2e2-eb6bd69f6f50",
    "name": "Bidar",
    "state": null,
    "population": null
  },
  {
    "id": "4ded930b-2721-4ce8-bded-af87807b7816",
    "name": "Chamarajanagar",
    "state": null,
    "population": null
  },
  {
    "id": "2f82a9d4-18bd-4b2a-9c0f-a92099b66e98",
    "name": "Chikkaballapur",
    "state": null,
    "population": null
  },
  {
    "id": "72437c0e-f8fd-4ca2-9e27-0784343cb8ac",
    "name": "Chikkamagaluru",
    "state": null,
    "population": null
  },
  {
    "id": "9eb49de7-8983-4d1a-9987-22d4e438f6df",
    "name": "Chitradurga",
    "state": null,
    "population": null
  },
  {
    "id": "ef61a4f4-2fd5-4116-bea5-7fc2838d4b2c",
    "name": "Dakshina Kannada",
    "state": null,
    "population": null
  },
  {
    "id": "a1d9ee79-0a83-4392-9f9c-07e5d1015c48",
    "name": "Davanagere",
    "state": null,
    "population": null
  },
  {
    "id": "e4846dc4-b95b-4f6d-9614-7b2974bed954",
    "name": "Dharwad",
    "state": null,
    "population": null
  },
  {
    "id": "0e671165-ad57-427e-aa48-0b35eddad590",
    "name": "Gadag",
    "state": null,
    "population": null
  },
  {
    "id": "c556cace-805b-469b-a10f-3277c189c111",
    "name": "Hassan",
    "state": null,
    "population": null
  },
  {
    "id": "c7a32d16-de14-4c26-ba25-3fb497ea39a3",
    "name": "Haveri",
    "state": null,
    "population": null
  },
  {
    "id": "78fde344-43b4-4191-8aa6-53d893e72fa7",
    "name": "Kalaburagi",
    "state": null,
    "population": null
  },
  {
    "id": "2ddc1089-65bc-43fe-b684-e734f366223f",
    "name": "Kodagu",
    "state": null,
    "population": null
  },
  {
    "id": "d246ed3c-4c5a-401e-bfd0-f31fb2682a91",
    "name": "Kolar",
    "state": null,
    "population": null
  },
  {
    "id": "ecdc21bd-d555-4248-90a5-b451655d207b",
    "name": "Koppal",
    "state": null,
    "population": null
  },
  {
    "id": "9b5e4c14-9847-43da-a6c4-2cc44ae73b9e",
    "name": "Mandya",
    "state": null,
    "population": null
  },
  {
    "id": "b7d572b4-bc49-4422-87aa-53b216f50e39",
    "name": "Mysuru",
    "state": null,
    "population": null
  },
  {
    "id": "c7af75ff-044e-4af7-a251-e3bd6fbe8a03",
    "name": "Raichur",
    "state": null,
    "population": null
  },
  {
    "id": "53f17eb6-04d9-4785-bd23-6e93bacd7052",
    "name": "Ramanagara",
    "state": null,
    "population": null
  },
  {
    "id": "a3401b0c-0d9d-48dd-a7de-58e1822e7b34",
    "name": "Shivamogga",
    "state": null,
    "population": null
  },
  {
    "id": "2aa29b7b-7a16-494d-ab20-6ac4b046d38e",
    "name": "Test District",
    "state": null,
    "population": null
  },
  {
    "id": "57a16457-3924-47fe-93ff-3d712f898179",
    "name": "Tumakuru",
    "state": null,
    "population": null
  },
  {
    "id": "84e906c4-9615-4beb-a611-3b2d4977e53b",
    "name": "Udupi",
    "state": null,
    "population": null
  },
  {
    "id": "3826cad2-e3e6-4823-bb63-e6c6431704e9",
    "name": "Uttara Kannada",
    "state": null,
    "population": null
  },
  {
    "id": "e7257647-bbf9-4610-a0e2-48fc9a59db40",
    "name": "Vijayapura",
    "state": null,
    "population": null
  },
  {
    "id": "bd9f6476-f661-43d0-bdf1-d34d12c3d04a",
    "name": "Yadgir",
    "state": null,
    "population": null
  }
]
  ```
  </details>
- **3. GET http://testserver/api/v1/risk/zone/01036fbe-c25c-4336-9014-edb51277c675** 
  - Status Code: 200
  - Execution Time: 7.92 ms
  - Response Size: 338 bytes
  <details><summary>Response</summary>
  ```json
  {
  "entity_type": "zone",
  "entity_id": "01036fbe-c25c-4336-9014-edb51277c675",
  "entity_label": "Bagalkot",
  "score": 82.53926645515179,
  "severity": "critical",
  "shap_explanation": [
    {
      "feature": "historical_crime_rate",
      "contribution": 0.17285738060593214,
      "value": 761.0
    },
    {
      "feature": "population_density",
      "contribution": 0.23083199154633804,
      "value": 911011.0
    }
  ]
}
  ```
  </details>
---

### tests/test_risk.py::test_risk_person
**Status:** PASS
**Test Duration:** 0.01s
#### API Requests
- **1. POST http://testserver/api/v1/auth/login** 
  - Status Code: 200
  - Execution Time: 378.35 ms
  - Response Size: 647 bytes
  <details><summary>Payload</summary>
  ```json
  {
  "badge_no": "ADMIN001",
  "password": "Admin@123"
}
  ```
  </details>
  <details><summary>Response</summary>
  ```json
  {
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmYTM3MGUxNS05YjE2LTQ3OTUtYTA3Ni1jYmY5OGYwZTJhY2UiLCJ0eXBlIjoiYWNjZXNzIiwiaWF0IjoxNzg0MDQzMDg2LCJleHAiOjE3ODQwNDY2ODYsInJvbGUiOiJhZG1pbiJ9.N3XWuvScE1mNvwg9KHDyokfi9kK_DgGe4pzvqPiOpMA",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmYTM3MGUxNS05YjE2LTQ3OTUtYTA3Ni1jYmY5OGYwZTJhY2UiLCJ0eXBlIjoicmVmcmVzaCIsImlhdCI6MTc4NDA0MzA4NiwiZXhwIjoxNzg0NjQ3ODg2fQ.PUfF1Ak_gZkHodUlilHLk_ENgBIrnP9ZuCN3zScph04",
  "token_type": "bearer",
  "user": {
    "id": "fa370e15-9b16-4795-a076-cbf98f0e2ace",
    "name": "System Admin",
    "badge_no": "ADMIN001",
    "role": "admin",
    "is_active": true,
    "station_id": null
  }
}
  ```
  </details>
- **2. GET http://testserver/api/v1/risk/person/a1fe4352-b263-47b9-9ec1-bdc0db21a439** 
  - Status Code: 200
  - Execution Time: 7.47 ms
  - Response Size: 340 bytes
  <details><summary>Response</summary>
  ```json
  {
  "entity_type": "person",
  "entity_id": "a1fe4352-b263-47b9-9ec1-bdc0db21a439",
  "entity_label": "Person a1fe4352-b263-47b9-9ec1-bdc0db21a439",
  "score": 42.0,
  "severity": "medium",
  "shap_explanation": [
    {
      "feature": "historical_case_density",
      "contribution": 0.6,
      "value": "baseline"
    },
    {
      "feature": "model_not_yet_trained",
      "contribution": 0.0,
      "value": "fallback"
    }
  ]
}
  ```
  </details>
---

### tests/test_search.py::test_search_semantic
**Status:** SKIPPED
**Test Duration:** 0.42s
#### API Requests
- **1. POST http://testserver/api/v1/auth/login** 
  - Status Code: 200
  - Execution Time: 406.32 ms
  - Response Size: 647 bytes
  <details><summary>Payload</summary>
  ```json
  {
  "badge_no": "ADMIN001",
  "password": "Admin@123"
}
  ```
  </details>
  <details><summary>Response</summary>
  ```json
  {
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmYTM3MGUxNS05YjE2LTQ3OTUtYTA3Ni1jYmY5OGYwZTJhY2UiLCJ0eXBlIjoiYWNjZXNzIiwiaWF0IjoxNzg0MDQzMDg3LCJleHAiOjE3ODQwNDY2ODcsInJvbGUiOiJhZG1pbiJ9.guQdsb3lWJ5f_ZZPR6-YutsYgZJt1ZMrzZS0y_N_Bhg",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmYTM3MGUxNS05YjE2LTQ3OTUtYTA3Ni1jYmY5OGYwZTJhY2UiLCJ0eXBlIjoicmVmcmVzaCIsImlhdCI6MTc4NDA0MzA4NywiZXhwIjoxNzg0NjQ3ODg3fQ.CnEZysEfp7Wgh1EQJ2J2UAfREvcN87B3f9jBApCRDJw",
  "token_type": "bearer",
  "user": {
    "id": "fa370e15-9b16-4795-a076-cbf98f0e2ace",
    "name": "System Admin",
    "badge_no": "ADMIN001",
    "role": "admin",
    "is_active": true,
    "station_id": null
  }
}
  ```
  </details>
- **2. GET http://testserver/api/v1/health/ai** 
  - Status Code: 404
  - Execution Time: 2.23 ms
  - Response Size: 22 bytes
  <details><summary>Response</summary>
  ```json
  {
  "detail": "Not Found"
}
  ```
  </details>
---

### tests/test_search.py::test_search_semantic_invalid_payload
**Status:** PASS
**Test Duration:** 0.00s
#### API Requests
- **1. POST http://testserver/api/v1/auth/login** 
  - Status Code: 200
  - Execution Time: 382.55 ms
  - Response Size: 647 bytes
  <details><summary>Payload</summary>
  ```json
  {
  "badge_no": "ADMIN001",
  "password": "Admin@123"
}
  ```
  </details>
  <details><summary>Response</summary>
  ```json
  {
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmYTM3MGUxNS05YjE2LTQ3OTUtYTA3Ni1jYmY5OGYwZTJhY2UiLCJ0eXBlIjoiYWNjZXNzIiwiaWF0IjoxNzg0MDQzMDg3LCJleHAiOjE3ODQwNDY2ODcsInJvbGUiOiJhZG1pbiJ9.guQdsb3lWJ5f_ZZPR6-YutsYgZJt1ZMrzZS0y_N_Bhg",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmYTM3MGUxNS05YjE2LTQ3OTUtYTA3Ni1jYmY5OGYwZTJhY2UiLCJ0eXBlIjoicmVmcmVzaCIsImlhdCI6MTc4NDA0MzA4NywiZXhwIjoxNzg0NjQ3ODg3fQ.CnEZysEfp7Wgh1EQJ2J2UAfREvcN87B3f9jBApCRDJw",
  "token_type": "bearer",
  "user": {
    "id": "fa370e15-9b16-4795-a076-cbf98f0e2ace",
    "name": "System Admin",
    "badge_no": "ADMIN001",
    "role": "admin",
    "is_active": true,
    "station_id": null
  }
}
  ```
  </details>
- **2. POST http://testserver/api/v1/search/semantic** 
  - Status Code: 422
  - Execution Time: 3.77 ms
  - Response Size: 97 bytes
  <details><summary>Payload</summary>
  ```json
  {
  "top_k": 5
}
  ```
  </details>
  <details><summary>Response</summary>
  ```json
  {
  "detail": [
    {
      "type": "missing",
      "loc": [
        "body",
        "query"
      ],
      "msg": "Field required",
      "input": {
        "top_k": 5
      }
    }
  ]
}
  ```
  </details>
---

### tests/test_users.py::test_users_crud
**Status:** PASS
**Test Duration:** 0.48s
#### API Requests
- **1. POST http://testserver/api/v1/auth/login** 
  - Status Code: 200
  - Execution Time: 516.12 ms
  - Response Size: 647 bytes
  <details><summary>Payload</summary>
  ```json
  {
  "badge_no": "ADMIN001",
  "password": "Admin@123"
}
  ```
  </details>
  <details><summary>Response</summary>
  ```json
  {
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmYTM3MGUxNS05YjE2LTQ3OTUtYTA3Ni1jYmY5OGYwZTJhY2UiLCJ0eXBlIjoiYWNjZXNzIiwiaWF0IjoxNzg0MDQzMDg4LCJleHAiOjE3ODQwNDY2ODgsInJvbGUiOiJhZG1pbiJ9.kxb4R77IP1CX6MRc8HUiBd-vquMIfjvD5C2lL-VwaG0",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmYTM3MGUxNS05YjE2LTQ3OTUtYTA3Ni1jYmY5OGYwZTJhY2UiLCJ0eXBlIjoicmVmcmVzaCIsImlhdCI6MTc4NDA0MzA4OCwiZXhwIjoxNzg0NjQ3ODg4fQ.t-EDGx-DZ_rzOjsfGoiGIa7mhAY_e5UZRjcey9QIxxg",
  "token_type": "bearer",
  "user": {
    "id": "fa370e15-9b16-4795-a076-cbf98f0e2ace",
    "name": "System Admin",
    "badge_no": "ADMIN001",
    "role": "admin",
    "is_active": true,
    "station_id": null
  }
}
  ```
  </details>
- **2. POST http://testserver/api/v1/users** 
  - Status Code: 201
  - Execution Time: 419.72 ms
  - Response Size: 145 bytes
  <details><summary>Payload</summary>
  ```json
  {
  "name": "Test Officer",
  "badge_no": "KSP-00F586",
  "role": "constable",
  "password": "Password123"
}
  ```
  </details>
  <details><summary>Response</summary>
  ```json
  {
  "id": "a2e24e60-d4db-4bda-be6c-d27bdf784fcc",
  "name": "Test Officer",
  "badge_no": "KSP-00F586",
  "role": "constable",
  "is_active": true,
  "station_id": null
}
  ```
  </details>
- **3. GET http://testserver/api/v1/users** 
  - Status Code: 200
  - Execution Time: 14.85 ms
  - Response Size: 9727 bytes
  <details><summary>Response</summary>
  ```json
  [
  {
    "id": "20eb017b-dd57-45e3-a009-da0b8ccc207b",
    "name": "Analyst Test",
    "badge_no": "KSP-FIR-analyst",
    "role": "analyst",
    "is_active": true,
    "station_id": null
  },
  {
    "id": "90aa1c63-628d-4081-81cf-d068338f0fdf",
    "name": "Inspector Test",
    "badge_no": "KSP-TEST-001",
    "role": "sho",
    "is_active": true,
    "station_id": null
  },
  {
    "id": "61c87ec5-a061-4ab6-a817-a3643f349db7",
    "name": "Inspector Test2",
    "badge_no": "KSP-TEST-002",
    "role": "sho",
    "is_active": true,
    "station_id": null
  },
  {
    "id": "637f788d-94f1-448a-98ac-c801441391f7",
    "name": "Inspector Test3",
    "badge_no": "KSP-TEST-003",
    "role": "analyst",
    "is_active": true,
    "station_id": null
  },
  {
    "id": "eaddd6f3-59f4-4617-a705-641db52b6935",
    "name": "Officer 1",
    "badge_no": "KSP001",
    "role": "analyst",
    "is_active": true,
    "station_id": null
  },
  {
    "id": "d102d703-2860-4fb4-8344-ce77fdffa0bc",
    "name": "Officer 10",
    "badge_no": "KSP010",
    "role": "sp",
    "is_active": true,
    "station_id": null
  },
  {
    "id": "ce74529a-d293-4d04-bae1-e3667869d812",
    "name": "Officer 11",
    "badge_no": "KSP011",
    "role": "analyst",
    "is_active": true,
    "station_id": null
  },
  {
    "id": "7b298379-c688-4e24-9e29-22153723f84c",
    "name": "Officer 12",
    "badge_no": "KSP012",
    "role": "constable",
    "is_active": true,
    "station_id": "cb5e6149-fdfa-4e86-8f82-ac079e870ae0"
  },
  {
    "id": "cfb837d1-948f-4728-ba9e-0b80e0e864da",
    "name": "Officer 13",
    "badge_no": "KSP013",
    "role": "analyst",
    "is_active": true,
    "station_id": null
  },
  {
    "id": "3bceda51-a375-49be-a87b-f19c81b34162",
    "name": "Officer 14",
    "badge_no": "KSP014",
    "role": "analyst",
    "is_active": true,
    "station_id": null
  },
  {
    "id": "e0ba2ba5-aedc-4564-8456-172e035f4e69",
    "name": "Officer 15",
    "badge_no": "KSP015",
    "role": "constable",
    "is_active": true,
    "station_id": "72929db2-f497-44be-91d8-28ff572670b7"
  },
  {
    "id": "5e72bd1f-222c-46b5-a7bc-6186e2a0460c",
    "name": "Officer 16",
    "badge_no": "KSP016",
    "role": "constable",
    "is_active": true,
    "station_id": "504e9167-58f0-4b31-9a7b-b9080bfb3223"
  },
  {
    "id": "86e9b18e-ed19-4108-abe2-94ffa2dda974",
    "name": "Officer 17",
    "badge_no": "KSP017",
    "role": "commissioner",
    "is_active": true,
    "station_id": null
  },
  {
    "id": "4fda03ef-da8b-47b4-ab9d-4fa1e40e07cd",
    "name": "Officer 18",
    "badge_no": "KSP018",
    "role": "constable",
    "is_active": true,
    "station_id": "badbac62-09a0-4495-a889-84e78928ec0d"
  },
  {
    "id": "66a9fe3c-d32a-4b36-99d3-ba8b6d157f88",
    "name": "Officer 19",
    "badge_no": "KSP019",
    "role": "sho",
    "is_active": true,
    "station_id": "bdb92472-0108-4218-834d-1d6a84c2fad8"
  },
  {
    "id": "03a9b67a-7274-4c0e-8e7a-5705b1a718be",
    "name": "Officer 2",
    "badge_no": "KSP002",
    "role": "sho",
    "is_active": true,
    "station_id": "080d6004-6c0b-492f-a542-05a8c6db82a5"
  },
  {
    "id": "cbc1311b-9cb2-4195-a84c-450e4d655eab",
    "name": "Officer 20",
    "badge_no": "KSP020",
    "role": "commissioner",
    "is_active": true,
    "station_id": null
  },
  {
    "id": "3d07c9f0-d069-4067-9183-9aeb8f0e15d3",
    "name": "Officer 21",
    "badge_no": "KSP021",
    "role": "constable",
    "is_active": true,
    "station_id": "bd7856e8-16bf-4973-9ea6-47a102165fb8"
  },
  {
    "id": "d422ea61-6309-4fd8-8dfc-876f7ef26d76",
    "name": "Officer 22",
    "badge_no": "KSP022",
    "role": "sho",
    "is_active": true,
    "station_id": "2489197f-43d6-40b2-bee7-76530167fcb7"
  },
  {
    "id": "b4f6a11a-bbfa-49f5-bf14-b976512054d6",
    "name": "Officer 23",
    "badge_no": "KSP023",
    "role": "commissioner",
    "is_active": true,
    "station_id": null
  },
  {
    "id": "a35a3f86-7614-469b-9947-c88481fc0e36",
    "name": "Officer 24",
    "badge_no": "KSP024",
    "role": "constable",
    "is_active": true,
    "station_id": "3c205e18-5485-4ac3-bb44-971a9a410f0a"
  },
  {
    "id": "67e2e95f-b5ba-4600-aae0-a695bb2ab611",
    "name": "Officer 25",
    "badge_no": "KSP025",
    "role": "commissioner",
    "is_active": true,
    "station_id": null
  },
  {
    "id": "14f4d2ed-faec-4967-b048-86308e0f793b",
    "name": "Officer 26",
    "badge_no": "KSP026",
    "role": "sp",
    "is_active": true,
    "station_id": null
  },
  {
    "id": "6906f795-a83c-4826-8f46-d1c777cbe404",
    "name": "Officer 27",
    "badge_no": "KSP027",
    "role": "commissioner",
    "is_active": true,
    "station_id": null
  },
  {
    "id": "ec803a53-bca1-4016-bd84-9dd93c006863",
    "name": "Officer 28",
    "badge_no": "KSP028",
    "role": "sp",
    "is_active": true,
    "station_id": null
  },
  {
    "id": "0784b1ab-42db-491f-a44e-7222c6ef6a96",
    "name": "Officer 29",
    "badge_no": "KSP029",
    "role": "analyst",
    "is_active": true,
    "station_id": null
  },
  {
    "id": "85b2a42e-8c8b-46dc-8a0e-181a771e1f2b",
    "name": "Officer 3",
    "badge_no": "KSP003",
    "role": "analyst",
    "is_active": true,
    "station_id": null
  },
  {
    "id": "634b8f77-2317-4265-9191-981aa45581e8",
    "name": "Officer 30",
    "badge_no": "KSP030",
    "role": "analyst",
    "is_active": true,
    "station_id": null
  },
  {
    "id": "0d0114b7-f64a-4dd3-820d-e2d402977c9e",
    "name": "Officer 31",
    "badge_no": "KSP031",
    "role": "constable",
    "is_active": true,
    "station_id": "3c205e18-5485-4ac3-bb44-971a9a410f0a"
  },
  {
    "id": "0b5b2307-055e-4b26-a41c-c04aaae39542",
    "name": "Officer 32",
    "badge_no": "KSP032",
    "role": "sp",
    "is_active": true,
    "station_id": null
  },
  {
    "id": "a017e7e1-16c4-4207-910b-bb0e3af394e4",
    "name": "Officer 33",
    "badge_no": "KSP033",
    "role": "commissioner",
    "is_active": true,
    "station_id": null
  },
  {
    "id": "f9d54898-0471-4a3c-963a-ab63b126e5b9",
    "name": "Officer 34",
    "badge_no": "KSP034",
    "role": "commissioner",
    "is_active": true,
    "station_id": null
  },
  {
    "id": "8a9fafcc-7b8e-43a0-94c8-4af1580f5c41",
    "name": "Officer 35",
    "badge_no": "KSP035",
    "role": "sho",
    "is_active": true,
    "station_id": "1f6535e8-ef5a-481f-b775-c5dcfebf489d"
  },
  {
    "id": "6c7c1af0-0cfa-4b75-9887-caf64b72dc01",
    "name": "Officer 36",
    "badge_no": "KSP036",
    "role": "constable",
    "is_active": true,
    "station_id": "766aa7e5-f70a-4457-b2cc-faedfaf513dd"
  },
  {
    "id": "357f7f4f-e5ec-4e77-a6c4-6c3505d0f3d4",
    "name": "Officer 37",
    "badge_no": "KSP037",
    "role": "sp",
    "is_active": true,
    "station_id": null
  },
  {
    "id": "76056ba9-ef66-4530-840d-df094870663d",
    "name": "Officer 38",
    "badge_no": "KSP038",
    "role": "commissioner",
    "is_active": true,
    "station_id": null
  },
  {
    "id": "bf8eb677-95ed-4c68-a20e-1660d086c441",
    "name": "Officer 39",
    "badge_no": "KSP039",
    "role": "constable",
    "is_active": true,
    "station_id": "9c23eedd-88e1-4e0e-b241-60c19102ca6d"
  },
  {
    "id": "b6eeb184-1dc9-4c22-93a5-efe8d42da8c2",
    "name": "Officer 4",
    "badge_no": "KSP004",
    "role": "analyst",
    "is_active": true,
    "station_id": null
  },
  {
    "id": "020de7a6-50dd-490e-858e-49f03abf2ccf",
    "name": "Officer 40",
    "badge_no": "KSP040",
    "role": "analyst",
    "is_active": true,
    "station_id": null
  },
  {
    "id": "4db83b08-86db-4d19-81d5-899e471735d7",
    "name": "Officer 41",
    "badge_no": "KSP041",
    "role": "commissioner",
    "is_active": true,
    "station_id": null
  },
  {
    "id": "f431c88b-bcca-4859-98ad-418a0b98c040",
    "name": "Officer 5",
    "badge_no": "KSP005",
    "role": "sho",
    "is_active": true,
    "station_id": "7b41fd96-aa5d-4390-8ad8-600546ed4ba7"
  },
  {
    "id": "71b0884c-2ad4-4f0f-a5cc-4ff21ddc0c61",
    "name": "Officer 6",
    "badge_no": "KSP006",
    "role": "sho",
    "is_active": true,
    "station_id": "919974c2-e3f4-4a1e-b822-88481c357d1b"
  },
  {
    "id": "eac7bf65-6bd7-4724-b701-c832a536c904",
    "name": "Officer 7",
    "badge_no": "KSP007",
    "role": "sp",
    "is_active": true,
    "station_id": null
  },
  {
    "id": "64cf2a3e-d08e-4eec-b27f-0d7c6f490045",
    "name": "Officer 8",
    "badge_no": "KSP008",
    "role": "analyst",
    "is_active": true,
    "station_id": null
  },
  {
    "id": "ec739b4d-062c-4544-8ae9-661653dd9443",
    "name": "Officer 9",
    "badge_no": "KSP009",
    "role": "sho",
    "is_active": true,
    "station_id": "3c30e794-af6a-4827-9947-36bb1c17ef90"
  },
  {
    "id": "fa370e15-9b16-4795-a076-cbf98f0e2ace",
    "name": "System Admin",
    "badge_no": "ADMIN001",
    "role": "admin",
    "is_active": true,
    "station_id": null
  },
  {
    "id": "a2e24e60-d4db-4bda-be6c-d27bdf784fcc",
    "name": "Test Officer",
    "badge_no": "KSP-00F586",
    "role": "constable",
    "is_active": true,
    "station_id": null
  },
  {
    "id": "bb10c10e-e814-42c3-b1b1-3b2288337477",
    "name": "Test Officer",
    "badge_no": "KSP-0F8C09",
    "role": "constable",
    "is_active": true,
    "station_id": null
  },
  {
    "id": "cd426003-0d3e-49e8-bd95-bc952f1d9507",
    "name": "Test Officer",
    "badge_no": "KSP-9A72BC",
    "role": "constable",
    "is_active": true,
    "station_id": null
  },
  {
    "id": "70c6793c-c64f-4e88-9ddc-dfc0243548e3",
    "name": "Test Officer",
    "badge_no": "KSP-7B8D0E",
    "role": "constable",
    "is_active": true,
    "station_id": null
  },
  {
    "id": "34521b07-39fc-404c-ad08-6eb88b6c042a",
    "name": "Test Officer",
    "badge_no": "KSP-F3E8F4",
    "role": "constable",
    "is_active": true,
    "station_id": null
  },
  {
    "id": "98aa3317-4fb1-4d5f-b870-4817c579e32e",
    "name": "Test Officer",
    "badge_no": "KSP-4917E1",
    "role": "constable",
    "is_active": true,
    "station_id": null
  },
  {
    "id": "edcbce22-4e46-4ab2-b999-ea9a25f165ab",
    "name": "Test Officer",
    "badge_no": "KSP-FA8643",
    "role": "constable",
    "is_active": true,
    "station_id": null
  },
  {
    "id": "ba1fd939-6a02-4bb2-b195-f95d0ab4dc4c",
    "name": "Test Officer",
    "badge_no": "KSP-8FA5DF",
    "role": "constable",
    "is_active": true,
    "station_id": null
  },
  {
    "id": "5e02c0bc-19b5-41e1-81ea-42fa80c34f80",
    "name": "Test Officer",
    "badge_no": "KSP-287D0A",
    "role": "constable",
    "is_active": true,
    "station_id": null
  },
  {
    "id": "b713b238-0387-4d79-86f2-bd0fb1648dde",
    "name": "Test Officer",
    "badge_no": "KSP-7A776A",
    "role": "constable",
    "is_active": true,
    "station_id": null
  },
  {
    "id": "a7095100-1830-467e-b2b7-ac479d7670fa",
    "name": "Updated Officer",
    "badge_no": "KSP-FAAC79",
    "role": "constable",
    "is_active": true,
    "station_id": null
  },
  {
    "id": "532292ca-76f0-44d3-bde5-3a3331d9b1c0",
    "name": "Updated Officer",
    "badge_no": "KSP-85E2FA",
    "role": "constable",
    "is_active": true,
    "station_id": null
  },
  {
    "id": "d3e15580-4499-4f5b-886b-fe91ec9e151a",
    "name": "Updated Officer",
    "badge_no": "KSP-FBBF39",
    "role": "constable",
    "is_active": true,
    "station_id": null
  },
  {
    "id": "0639c373-ff8c-47bf-8b48-bc37c88b9aa7",
    "name": "Updated Officer",
    "badge_no": "KSP-A207F3",
    "role": "constable",
    "is_active": true,
    "station_id": null
  },
  {
    "id": "f66f82f8-5e66-4171-8cf1-2a8737a06c69",
    "name": "Updated Officer",
    "badge_no": "KSP-03C71C",
    "role": "constable",
    "is_active": true,
    "station_id": null
  },
  {
    "id": "0bf21d3c-41b7-4bd0-af54-d06068142d4a",
    "name": "Updated Officer",
    "badge_no": "KSP-6BF118",
    "role": "constable",
    "is_active": true,
    "station_id": null
  },
  {
    "id": "62755507-bf49-438c-bf5f-817703ab4747",
    "name": "Updated Officer",
    "badge_no": "KSP-DBB760",
    "role": "constable",
    "is_active": true,
    "station_id": null
  },
  {
    "id": "c98e825f-89ec-43cf-9696-48d7000999cf",
    "name": "Updated Officer",
    "badge_no": "KSP-FC3050",
    "role": "constable",
    "is_active": true,
    "station_id": null
  },
  {
    "id": "a963d9d0-8899-406e-84d1-78eb118103a9",
    "name": "Updated Officer",
    "badge_no": "KSP-20396E",
    "role": "constable",
    "is_active": true,
    "station_id": null
  }
]
  ```
  </details>
- **4. GET http://testserver/api/v1/users/a2e24e60-d4db-4bda-be6c-d27bdf784fcc** 
  - Status Code: 200
  - Execution Time: 10.95 ms
  - Response Size: 145 bytes
  <details><summary>Response</summary>
  ```json
  {
  "id": "a2e24e60-d4db-4bda-be6c-d27bdf784fcc",
  "name": "Test Officer",
  "badge_no": "KSP-00F586",
  "role": "constable",
  "is_active": true,
  "station_id": null
}
  ```
  </details>
- **5. PATCH http://testserver/api/v1/users/a2e24e60-d4db-4bda-be6c-d27bdf784fcc** 
  - Status Code: 200
  - Execution Time: 17.67 ms
  - Response Size: 148 bytes
  <details><summary>Payload</summary>
  ```json
  {
  "name": "Updated Officer"
}
  ```
  </details>
  <details><summary>Response</summary>
  ```json
  {
  "id": "a2e24e60-d4db-4bda-be6c-d27bdf784fcc",
  "name": "Updated Officer",
  "badge_no": "KSP-00F586",
  "role": "constable",
  "is_active": true,
  "station_id": null
}
  ```
  </details>
- **6. GET http://testserver/api/v1/users/a2e24e60-d4db-4bda-be6c-d27bdf784fcc** 
  - Status Code: 200
  - Execution Time: 11.75 ms
  - Response Size: 148 bytes
  <details><summary>Response</summary>
  ```json
  {
  "id": "a2e24e60-d4db-4bda-be6c-d27bdf784fcc",
  "name": "Updated Officer",
  "badge_no": "KSP-00F586",
  "role": "constable",
  "is_active": true,
  "station_id": null
}
  ```
  </details>
---

### tests/test_users.py::test_create_duplicate_user
**Status:** PASS
**Test Duration:** 0.35s
#### API Requests
- **1. POST http://testserver/api/v1/auth/login** 
  - Status Code: 200
  - Execution Time: 377.50 ms
  - Response Size: 647 bytes
  <details><summary>Payload</summary>
  ```json
  {
  "badge_no": "ADMIN001",
  "password": "Admin@123"
}
  ```
  </details>
  <details><summary>Response</summary>
  ```json
  {
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmYTM3MGUxNS05YjE2LTQ3OTUtYTA3Ni1jYmY5OGYwZTJhY2UiLCJ0eXBlIjoiYWNjZXNzIiwiaWF0IjoxNzg0MDQzMDg4LCJleHAiOjE3ODQwNDY2ODgsInJvbGUiOiJhZG1pbiJ9.kxb4R77IP1CX6MRc8HUiBd-vquMIfjvD5C2lL-VwaG0",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmYTM3MGUxNS05YjE2LTQ3OTUtYTA3Ni1jYmY5OGYwZTJhY2UiLCJ0eXBlIjoicmVmcmVzaCIsImlhdCI6MTc4NDA0MzA4OCwiZXhwIjoxNzg0NjQ3ODg4fQ.t-EDGx-DZ_rzOjsfGoiGIa7mhAY_e5UZRjcey9QIxxg",
  "token_type": "bearer",
  "user": {
    "id": "fa370e15-9b16-4795-a076-cbf98f0e2ace",
    "name": "System Admin",
    "badge_no": "ADMIN001",
    "role": "admin",
    "is_active": true,
    "station_id": null
  }
}
  ```
  </details>
- **2. POST http://testserver/api/v1/users** 
  - Status Code: 201
  - Execution Time: 341.24 ms
  - Response Size: 145 bytes
  <details><summary>Payload</summary>
  ```json
  {
  "name": "Test Officer",
  "badge_no": "KSP-8B9AF9",
  "role": "constable",
  "password": "Password123"
}
  ```
  </details>
  <details><summary>Response</summary>
  ```json
  {
  "id": "ede9ec74-c60b-46b2-b5fb-636ebfc82e5d",
  "name": "Test Officer",
  "badge_no": "KSP-8B9AF9",
  "role": "constable",
  "is_active": true,
  "station_id": null
}
  ```
  </details>
- **3. POST http://testserver/api/v1/users** 
  - Status Code: 409
  - Execution Time: 10.32 ms
  - Response Size: 54 bytes
  <details><summary>Payload</summary>
  ```json
  {
  "name": "Test Officer",
  "badge_no": "KSP-8B9AF9",
  "role": "constable",
  "password": "Password123"
}
  ```
  </details>
  <details><summary>Response</summary>
  ```json
  {
  "detail": "Badge number 'KSP-8B9AF9' already exists."
}
  ```
  </details>
---

### tests/test_users.py::test_get_nonexistent_user
**Status:** PASS
**Test Duration:** 0.01s
#### API Requests
- **1. POST http://testserver/api/v1/auth/login** 
  - Status Code: 200
  - Execution Time: 423.06 ms
  - Response Size: 647 bytes
  <details><summary>Payload</summary>
  ```json
  {
  "badge_no": "ADMIN001",
  "password": "Admin@123"
}
  ```
  </details>
  <details><summary>Response</summary>
  ```json
  {
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmYTM3MGUxNS05YjE2LTQ3OTUtYTA3Ni1jYmY5OGYwZTJhY2UiLCJ0eXBlIjoiYWNjZXNzIiwiaWF0IjoxNzg0MDQzMDg5LCJleHAiOjE3ODQwNDY2ODksInJvbGUiOiJhZG1pbiJ9.uHb9ziMbVpn7dUddE8MXHpqBx-vORPBkFUzFT6I15Lc",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmYTM3MGUxNS05YjE2LTQ3OTUtYTA3Ni1jYmY5OGYwZTJhY2UiLCJ0eXBlIjoicmVmcmVzaCIsImlhdCI6MTc4NDA0MzA4OSwiZXhwIjoxNzg0NjQ3ODg5fQ.2cGMrcUOtlclLNUfbKUgIAWnjOXN_mBwcQbSI8me0N0",
  "token_type": "bearer",
  "user": {
    "id": "fa370e15-9b16-4795-a076-cbf98f0e2ace",
    "name": "System Admin",
    "badge_no": "ADMIN001",
    "role": "admin",
    "is_active": true,
    "station_id": null
  }
}
  ```
  </details>
- **2. GET http://testserver/api/v1/users/5f737595-22b6-4131-b5dd-e61b4d37e183** 
  - Status Code: 404
  - Execution Time: 10.38 ms
  - Response Size: 65 bytes
  <details><summary>Response</summary>
  ```json
  {
  "detail": "User 5f737595-22b6-4131-b5dd-e61b4d37e183 not found."
}
  ```
  </details>
---

### tests/test_users.py::test_change_password
**Status:** PASS
**Test Duration:** 0.71s
#### API Requests
- **1. POST http://testserver/api/v1/auth/login** 
  - Status Code: 200
  - Execution Time: 376.19 ms
  - Response Size: 647 bytes
  <details><summary>Payload</summary>
  ```json
  {
  "badge_no": "ADMIN001",
  "password": "Admin@123"
}
  ```
  </details>
  <details><summary>Response</summary>
  ```json
  {
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmYTM3MGUxNS05YjE2LTQ3OTUtYTA3Ni1jYmY5OGYwZTJhY2UiLCJ0eXBlIjoiYWNjZXNzIiwiaWF0IjoxNzg0MDQzMDkwLCJleHAiOjE3ODQwNDY2OTAsInJvbGUiOiJhZG1pbiJ9.YIDT7KOhNn5civ0WaZTeDspz9TikE3rcLNF8m_3X2rM",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmYTM3MGUxNS05YjE2LTQ3OTUtYTA3Ni1jYmY5OGYwZTJhY2UiLCJ0eXBlIjoicmVmcmVzaCIsImlhdCI6MTc4NDA0MzA5MCwiZXhwIjoxNzg0NjQ3ODkwfQ.bwBxAJHjqd_BXro9CMj7nY4Qww6X4BzWDsLFJbpuqTE",
  "token_type": "bearer",
  "user": {
    "id": "fa370e15-9b16-4795-a076-cbf98f0e2ace",
    "name": "System Admin",
    "badge_no": "ADMIN001",
    "role": "admin",
    "is_active": true,
    "station_id": null
  }
}
  ```
  </details>
- **2. POST http://testserver/api/v1/users/me/change-password** 
  - Status Code: 200
  - Execution Time: 712.76 ms
  - Response Size: 44 bytes
  <details><summary>Payload</summary>
  ```json
  {
  "current_password": "Admin@123",
  "new_password": "Admin@123"
}
  ```
  </details>
  <details><summary>Response</summary>
  ```json
  {
  "message": "Password updated successfully."
}
  ```
  </details>
---

### tests/test_users.py::test_invalid_role
**Status:** PASS
**Test Duration:** 0.01s
#### API Requests
- **1. POST http://testserver/api/v1/auth/login** 
  - Status Code: 200
  - Execution Time: 399.73 ms
  - Response Size: 647 bytes
  <details><summary>Payload</summary>
  ```json
  {
  "badge_no": "ADMIN001",
  "password": "Admin@123"
}
  ```
  </details>
  <details><summary>Response</summary>
  ```json
  {
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmYTM3MGUxNS05YjE2LTQ3OTUtYTA3Ni1jYmY5OGYwZTJhY2UiLCJ0eXBlIjoiYWNjZXNzIiwiaWF0IjoxNzg0MDQzMDkxLCJleHAiOjE3ODQwNDY2OTEsInJvbGUiOiJhZG1pbiJ9.wGAX1srVyTDQ5n4sCyXtS56Ax7jJfNyRyE1XEMsr-bI",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmYTM3MGUxNS05YjE2LTQ3OTUtYTA3Ni1jYmY5OGYwZTJhY2UiLCJ0eXBlIjoicmVmcmVzaCIsImlhdCI6MTc4NDA0MzA5MSwiZXhwIjoxNzg0NjQ3ODkxfQ.4BKD5KK8Z3sH8oAGDw0KID0wZ_kRxX00AIKaKJfuRhY",
  "token_type": "bearer",
  "user": {
    "id": "fa370e15-9b16-4795-a076-cbf98f0e2ace",
    "name": "System Admin",
    "badge_no": "ADMIN001",
    "role": "admin",
    "is_active": true,
    "station_id": null
  }
}
  ```
  </details>
- **2. POST http://testserver/api/v1/users** 
  - Status Code: 422
  - Execution Time: 9.64 ms
  - Response Size: 244 bytes
  <details><summary>Payload</summary>
  ```json
  {
  "name": "Test Officer",
  "badge_no": "KSP-237460",
  "role": "INVALID_ROLE",
  "password": "Password123"
}
  ```
  </details>
  <details><summary>Response</summary>
  ```json
  {
  "detail": [
    {
      "type": "enum",
      "loc": [
        "body",
        "role"
      ],
      "msg": "Input should be 'constable', 'sho', 'sp', 'commissioner', 'analyst' or 'admin'",
      "input": "INVALID_ROLE",
      "ctx": {
        "expected": "'constable', 'sho', 'sp', 'commissioner', 'analyst' or 'admin'"
      }
    }
  ]
}
  ```
  </details>
---

### tests/test_vehicles.py::test_vehicles_theft_trends
**Status:** PASS
**Test Duration:** 0.01s
#### API Requests
- **1. POST http://testserver/api/v1/auth/login** 
  - Status Code: 200
  - Execution Time: 463.66 ms
  - Response Size: 647 bytes
  <details><summary>Payload</summary>
  ```json
  {
  "badge_no": "ADMIN001",
  "password": "Admin@123"
}
  ```
  </details>
  <details><summary>Response</summary>
  ```json
  {
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmYTM3MGUxNS05YjE2LTQ3OTUtYTA3Ni1jYmY5OGYwZTJhY2UiLCJ0eXBlIjoiYWNjZXNzIiwiaWF0IjoxNzg0MDQzMDkxLCJleHAiOjE3ODQwNDY2OTEsInJvbGUiOiJhZG1pbiJ9.wGAX1srVyTDQ5n4sCyXtS56Ax7jJfNyRyE1XEMsr-bI",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmYTM3MGUxNS05YjE2LTQ3OTUtYTA3Ni1jYmY5OGYwZTJhY2UiLCJ0eXBlIjoicmVmcmVzaCIsImlhdCI6MTc4NDA0MzA5MSwiZXhwIjoxNzg0NjQ3ODkxfQ.4BKD5KK8Z3sH8oAGDw0KID0wZ_kRxX00AIKaKJfuRhY",
  "token_type": "bearer",
  "user": {
    "id": "fa370e15-9b16-4795-a076-cbf98f0e2ace",
    "name": "System Admin",
    "badge_no": "ADMIN001",
    "role": "admin",
    "is_active": true,
    "station_id": null
  }
}
  ```
  </details>
- **2. GET http://testserver/api/v1/vehicles/theft-trends** 
  - Status Code: 200
  - Execution Time: 13.97 ms
  - Response Size: 447 bytes
  <details><summary>Response</summary>
  ```json
  {
  "vehicle_type": null,
  "district_id": null,
  "points": [
    {
      "period": "2025-12-01",
      "stolen": 3,
      "recovered": 0
    },
    {
      "period": "2026-01-01",
      "stolen": 14,
      "recovered": 6
    },
    {
      "period": "2026-02-01",
      "stolen": 6,
      "recovered": 0
    },
    {
      "period": "2026-03-01",
      "stolen": 6,
      "recovered": 2
    },
    {
      "period": "2026-04-01",
      "stolen": 20,
      "recovered": 9
    },
    {
      "period": "2026-05-01",
      "stolen": 14,
      "recovered": 4
    },
    {
      "period": "2026-06-01",
      "stolen": 14,
      "recovered": 5
    },
    {
      "period": "2026-07-01",
      "stolen": 3,
      "recovered": 2
    }
  ]
}
  ```
  </details>
---

### tests/test_vehicles.py::test_vehicles_recovery_rate
**Status:** PASS
**Test Duration:** 0.01s
#### API Requests
- **1. POST http://testserver/api/v1/auth/login** 
  - Status Code: 200
  - Execution Time: 418.96 ms
  - Response Size: 647 bytes
  <details><summary>Payload</summary>
  ```json
  {
  "badge_no": "ADMIN001",
  "password": "Admin@123"
}
  ```
  </details>
  <details><summary>Response</summary>
  ```json
  {
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmYTM3MGUxNS05YjE2LTQ3OTUtYTA3Ni1jYmY5OGYwZTJhY2UiLCJ0eXBlIjoiYWNjZXNzIiwiaWF0IjoxNzg0MDQzMDkyLCJleHAiOjE3ODQwNDY2OTIsInJvbGUiOiJhZG1pbiJ9.EVUQ9jk_2R_DFVVj7_ikH88TkMLSNlh3ThNCvyjbNac",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmYTM3MGUxNS05YjE2LTQ3OTUtYTA3Ni1jYmY5OGYwZTJhY2UiLCJ0eXBlIjoicmVmcmVzaCIsImlhdCI6MTc4NDA0MzA5MiwiZXhwIjoxNzg0NjQ3ODkyfQ.kV0643-plH0o80VgyfANDtoFY5g7UhLX1aVs9iyCs28",
  "token_type": "bearer",
  "user": {
    "id": "fa370e15-9b16-4795-a076-cbf98f0e2ace",
    "name": "System Admin",
    "badge_no": "ADMIN001",
    "role": "admin",
    "is_active": true,
    "station_id": null
  }
}
  ```
  </details>
- **2. GET http://testserver/api/v1/vehicles/recovery-rate?vehicle_type=2w** 
  - Status Code: 200
  - Execution Time: 8.04 ms
  - Response Size: 86 bytes
  <details><summary>Response</summary>
  ```json
  {
  "vehicle_type": "2w",
  "total_stolen": 0,
  "total_recovered": 0,
  "recovery_rate_percent": 0.0
}
  ```
  </details>
---
