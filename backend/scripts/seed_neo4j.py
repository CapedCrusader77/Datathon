"""
One-Time Neo4j Seed Script for POLICEGPT
Seeds synthetic criminal intelligence graph into Neo4j:
- Persons, FIRs, Vehicles, Phones, Gangs, Locations
- Relationships: (:Person)-[:ACCUSED_IN]->(:FIR), (:Person)-[:OWNS]->(:Vehicle),
  (:Person)-[:MEMBER_OF]->(:Gang), (:Person)-[:LINKED_TO]->(:Person),
  (:Vehicle)-[:SEEN_AT]->(:Location), (:Person)-[:OWNS]->(:Phone)
"""
import asyncio
import logging
from neo4j import AsyncGraphDatabase
from app.core.config import settings

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def seed_neo4j():
    uri = settings.NEO4J_URI
    user = settings.NEO4J_USER
    password = settings.NEO4J_PASSWORD

    logger.info(f"Connecting to Neo4j at {uri}...")
    driver = AsyncGraphDatabase.driver(uri, auth=(user, password))

    try:
        async with driver.session() as session:
            logger.info("Clearing existing synthetic test graph...")
            await session.run("MATCH (n) DETACH DELETE n")

            logger.info("Creating entity nodes...")
            cypher_nodes = """
            // Persons
            CREATE (p1:Person {id: 'p1', label: 'Ravi Kumar S', risk: 'extreme', firs: 12})
            CREATE (p2:Person {id: 'p2', label: 'Suresh Nayak', risk: 'high', firs: 5})
            CREATE (p3:Person {id: 'p3', label: 'Deepa Mallesh', risk: 'medium', firs: 3})
            CREATE (p4:Person {id: 'p4', label: 'Arjun Patil', risk: 'high', firs: 7})
            CREATE (p5:Person {id: 'p5', label: 'Mahesh N', risk: 'medium', firs: 4})

            // Gangs
            CREATE (g1:Gang {id: 'g1', label: 'Bengaluru South Syndicate', risk: 'extreme', firs: 0})
            CREATE (g2:Gang {id: 'g2', label: 'Whitefield Crew', risk: 'high', firs: 0})

            // FIRs
            CREATE (f1:FIR {id: 'f1', label: 'CR-045/2024', risk: null, category: 'Robbery', status: 'open'})
            CREATE (f2:FIR {id: 'f2', label: 'CR-089/2023', risk: null, category: 'Burglary', status: 'chargesheeted'})
            CREATE (f3:FIR {id: 'f3', label: 'CR-034/2024', risk: null, category: 'Narcotics', status: 'open'})

            // Vehicles
            CREATE (v1:Vehicle {id: 'v1', label: 'KA-01-AB-1234', risk: null, model: 'Hyundai i20'})
            CREATE (v2:Vehicle {id: 'v2', label: 'KA-05-CD-5678', risk: null, model: 'Maruti Swift'})

            // Phones
            CREATE (ph1:Phone {id: 'ph1', label: '9900112233', risk: null, carrier: 'Jio'})
            CREATE (ph2:Phone {id: 'ph2', label: '9876543210', risk: null, carrier: 'Airtel'})

            // Locations
            CREATE (l1:Location {id: 'l1', label: 'Koramangala', risk: null, territory: true})
            CREATE (l2:Location {id: 'l2', label: 'Whitefield', risk: null, territory: true})

            // Relationships
            CREATE (p1)-[:LEADER_OF {role: 'Syndicate Boss'}]->(g1)
            CREATE (p2)-[:MEMBER_OF {role: 'Enforcer'}]->(g1)
            CREATE (p3)-[:MEMBER_OF {role: 'Informant'}]->(g1)
            CREATE (p4)-[:MEMBER_OF {role: 'Operative'}]->(g2)
            CREATE (p5)-[:MEMBER_OF {role: 'Associate'}]->(g2)

            CREATE (p1)-[:ACCUSED_IN {role: 'Main Accused'}]->(f1)
            CREATE (p2)-[:ACCUSED_IN {role: 'Co-Accused'}]->(f1)
            CREATE (p4)-[:ACCUSED_IN {role: 'Main Accused'}]->(f2)
            CREATE (p5)-[:ACCUSED_IN {role: 'Co-Accused'}]->(f2)
            CREATE (p1)-[:ACCUSED_IN {role: 'Conspirator'}]->(f3)
            CREATE (p3)-[:ACCUSED_IN {role: 'Courier'}]->(f3)

            CREATE (p1)-[:OWNS]->(v1)
            CREATE (p2)-[:OWNS]->(v2)
            CREATE (p4)-[:USES]->(v2)

            CREATE (p1)-[:OWNS]->(ph1)
            CREATE (p4)-[:OWNS]->(ph2)

            CREATE (p1)-[:LINKED_TO {type: 'Syndicate Partner'}]->(p2)
            CREATE (p2)-[:LINKED_TO {type: 'Co-Accused'}]->(p3)
            CREATE (p4)-[:LINKED_TO {type: 'Syndicate Partner'}]->(p5)
            CREATE (p1)-[:LINKED_TO {type: 'Rival Gang Contact'}]->(p4)

            CREATE (v1)-[:SEEN_AT]->(l1)
            CREATE (v2)-[:SEEN_AT]->(l2)
            """
            await session.run(cypher_nodes)
            logger.info("Successfully seeded synthetic data into Neo4j.")

            # Verify counts
            res_nodes = await session.run("MATCH (n) RETURN count(n) AS c")
            record_n = await res_nodes.single()
            res_edges = await session.run("MATCH ()-[r]->() RETURN count(r) AS c")
            record_e = await res_edges.single()
            logger.info(f"Verification: {record_n['c']} nodes, {record_e['c']} relationships created.")

    except Exception as e:
        logger.error(f"Failed to seed Neo4j: {e}")
        raise
    finally:
        await driver.close()


if __name__ == "__main__":
    asyncio.run(seed_neo4j())
