import pytest

@pytest.fixture
def check_assistant(client):
    resp = client.get("/api/v1/health/ai")
    if resp.status_code == 200:
        # Assuming assistant relies on semantic_search or similar. We'll just run it and skip on 5xx
        pass 

@pytest.mark.ai
@pytest.mark.integration
def test_assistant_chat(auth_client, check_assistant):
    payload = {
        "query": "What is the crime trend this month?",
        "context_mode": "general"
    }
    resp = auth_client.post("/api/v1/assistant/chat", json=payload)
    if resp.status_code in (500, 503, 502, 504):
        pytest.skip("Assistant AI service unavailable or LLM not configured")
    assert resp.status_code == 200
    assert "message" in resp.json()

@pytest.mark.ai
@pytest.mark.integration
def test_assistant_chat_invalid_payload(auth_client):
    payload = {
        "context_mode": "general" # missing message
    }
    resp = auth_client.post("/api/v1/assistant/chat", json=payload)
    assert resp.status_code == 422
