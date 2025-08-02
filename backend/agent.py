from langchain_groq import ChatGroq
from langchain.agents import initialize_agent, AgentType
from tools import get_tools
from dotenv import load_dotenv
import os

load_dotenv()

llm = ChatGroq(
    groq_api_key=os.getenv("GROQ_API_KEY"),
    model_name="Llama3-8b-8192",
    streaming=True,
)

tools = get_tools()

def run_agent(messages):
    agent = initialize_agent(tools, llm, agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION)
    prompt = messages[-1]['content'] if messages else "Hello"
    
    def event_stream():
        yield f"data: {agent.run(prompt)}\n\n"
    
    return event_stream()
