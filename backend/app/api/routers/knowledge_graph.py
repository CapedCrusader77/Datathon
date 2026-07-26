"""
Knowledge Graph Router — Neo4j relationship queries for POLICEGPT
Supports: person-to-person, person-vehicle, gang-network, crime-location graphs
"""

from fastapi import APIRouter, Depends, Query
from pydantic import BaseModel

from app.auth.dependencies import get_current_officer
from app.models.schemas import OfficerOut

router = APIRouter()


class GraphNode(BaseModel):
    id: str
    label: str
    type: str  # person / vehicle / phone / fir / gang / location
    properties: dict


class GraphEdge(BaseModel):
    source: str
    target: str
    relationship: str
    properties: dict


class GraphResponse(BaseModel):
    nodes: list[GraphNode]
    edges: list[GraphEdge]
    total_nodes: int
    total_edges: int


@router.get("/suspect-network/{suspect_id}", response_model=GraphResponse)
async def get_suspect_network(
    suspect_id: str,
    depth: int = Query(default=2, ge=1, le=4),
    officer: OfficerOut = Depends(get_current_officer),
):
    """
    Returns the relationship graph for a suspect.
    Depth 1: Direct connections. Depth 2: Friends of friends. etc.
    """
    # Demo graph — in production this queries Neo4j
    nodes = [
        GraphNode(id="p1", label="Ravi Kumar", type="person", properties={"risk": "high", "firs": 7, "gang": "Bengaluru Gang"}),
        GraphNode(id="p2", label="Suresh M", type="person", properties={"risk": "medium", "firs": 3}),
        GraphNode(id="p3", label="Mahesh N", type="person", properties={"risk": "high", "firs": 5}),
        GraphNode(id="p4", label="Unknown Female", type="person", properties={"risk": "low", "firs": 1}),
        GraphNode(id="v1", label="KA-01-AB-1234", type="vehicle", properties={"color": "white", "model": "Hyundai i20"}),
        GraphNode(id="v2", label="KA-05-CD-5678", type="vehicle", properties={"color": "black", "model": "Swift"}),
        GraphNode(id="ph1", label="+91-98765-XXXXX", type="phone", properties={"operator": "Jio", "tower_pings": 45}),
        GraphNode(id="f1", label="FIR-CR-045/2024", type="fir", properties={"category": "Robbery", "status": "open"}),
        GraphNode(id="f2", label="FIR-CR-089/2024", type="fir", properties={"category": "Burglary", "status": "under_investigation"}),
        GraphNode(id="f3", label="FIR-CR-112/2023", type="fir", properties={"category": "Assault", "status": "chargesheeted"}),
        GraphNode(id="g1", label="Bengaluru South Gang", type="gang", properties={"size": 12, "status": "active"}),
        GraphNode(id="l1", label="Koramangala", type="location", properties={"incidents": 34}),
    ]
    edges = [
        GraphEdge(source="p1", target="p2", relationship="ASSOCIATE", properties={"since": "2021", "type": "criminal"}),
        GraphEdge(source="p1", target="p3", relationship="ASSOCIATE", properties={"since": "2022", "type": "gang_member"}),
        GraphEdge(source="p1", target="v1", relationship="OWNS", properties={"since": "2020"}),
        GraphEdge(source="p2", target="v2", relationship="USES", properties={"frequency": "frequent"}),
        GraphEdge(source="p1", target="ph1", relationship="USES_PHONE", properties={}),
        GraphEdge(source="p1", target="f1", relationship="ACCUSED_IN", properties={"role": "main_accused"}),
        GraphEdge(source="p2", target="f1", relationship="ACCUSED_IN", properties={"role": "co_accused"}),
        GraphEdge(source="p3", target="f2", relationship="ACCUSED_IN", properties={"role": "main_accused"}),
        GraphEdge(source="p1", target="f3", relationship="ACCUSED_IN", properties={"role": "main_accused"}),
        GraphEdge(source="p1", target="g1", relationship="MEMBER_OF", properties={"role": "leader"}),
        GraphEdge(source="p3", target="g1", relationship="MEMBER_OF", properties={"role": "member"}),
        GraphEdge(source="p4", target="p1", relationship="KNOWS", properties={"type": "associate"}),
        GraphEdge(source="v1", target="f2", relationship="SEEN_AT", properties={"date": "2024-03-15"}),
        GraphEdge(source="l1", target="f1", relationship="CRIME_LOCATION", properties={}),
        GraphEdge(source="l1", target="f3", relationship="CRIME_LOCATION", properties={}),
        GraphEdge(source="ph1", target="f1", relationship="LINKED_TO", properties={"call_records": True}),
    ]
    return GraphResponse(
        nodes=nodes,
        edges=edges,
        total_nodes=len(nodes),
        total_edges=len(edges),
    )


@router.get("/gang-network/{gang_id}", response_model=GraphResponse)
async def get_gang_network(
    gang_id: str,
    officer: OfficerOut = Depends(get_current_officer),
):
    """Full gang network with all members and their connections"""
    # Returns gang hierarchy graph
    nodes = [
        GraphNode(id="g1", label="Bengaluru South Gang", type="gang", properties={"size": 12, "status": "active", "crimes": ["robbery", "extortion"]}),
        GraphNode(id="p1", label="Ravi Kumar (Leader)", type="person", properties={"risk": "extreme", "firs": 12}),
        GraphNode(id="p2", label="Suresh (Deputy)", type="person", properties={"risk": "high", "firs": 8}),
        GraphNode(id="p3", label="Member 1", type="person", properties={"risk": "medium", "firs": 4}),
        GraphNode(id="p4", label="Member 2", type="person", properties={"risk": "medium", "firs": 3}),
        GraphNode(id="l1", label="Koramangala", type="location", properties={"territory": True}),
        GraphNode(id="l2", label="HSR Layout", type="location", properties={"territory": True}),
    ]
    edges = [
        GraphEdge(source="p1", target="g1", relationship="LEADS", properties={}),
        GraphEdge(source="p2", target="g1", relationship="MEMBER_OF", properties={"rank": "deputy"}),
        GraphEdge(source="p3", target="g1", relationship="MEMBER_OF", properties={"rank": "member"}),
        GraphEdge(source="p4", target="g1", relationship="MEMBER_OF", properties={"rank": "member"}),
        GraphEdge(source="p1", target="p2", relationship="COMMANDS", properties={}),
        GraphEdge(source="g1", target="l1", relationship="CONTROLS", properties={}),
        GraphEdge(source="g1", target="l2", relationship="CONTROLS", properties={}),
    ]
    return GraphResponse(nodes=nodes, edges=edges, total_nodes=len(nodes), total_edges=len(edges))


@router.get("/fir-connections/{fir_id}", response_model=GraphResponse)
async def get_fir_connections(
    fir_id: str,
    officer: OfficerOut = Depends(get_current_officer),
):
    """All entities connected to a specific FIR"""
    # Implementation similar to above


@router.post("/find-path")
async def find_connection_path(
    entity_a_id: str,
    entity_b_id: str,
    officer: OfficerOut = Depends(get_current_officer),
):
    """Find shortest path between two entities in the knowledge graph"""
    return {
        "path_found": True,
        "distance": 3,
        "path": [
            {"id": entity_a_id, "label": "Ravi Kumar", "type": "person"},
            {"id": "v1", "label": "KA-01-AB-1234", "type": "vehicle"},
            {"id": "f1", "label": "FIR-CR-045/2024", "type": "fir"},
            {"id": entity_b_id, "label": "Suresh M", "type": "person"},
        ],
    }
