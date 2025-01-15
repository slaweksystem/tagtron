from ..models import Users, Projects, ProjectUsers
from ..routers.auth import bcrypt_context

data_users = [
    Users(
        username="johnny",
        email="johnnybravo@example.com",
        first_name="Johnny",
        last_name="Bravo",
        hashed_password=bcrypt_context.hash("1ubiepl@cki"),
        role_id="1",
    ),
    Users(
        username="sarah",
        email="sarah.connor@example.com",
        first_name="Sarah",
        last_name="Connor",
        hashed_password=bcrypt_context.hash("T3rm1nat0r!"),
        role_id="1",
    ),
    Users(
        username="mike",
        email="mike.wazowski@example.com",
        first_name="Mike",
        last_name="Wazowski",
        hashed_password=bcrypt_context.hash("m0nst3rInc$"),
        role_id="2",
    ),
    Users(
        username="elsa",
        email="elsa.frozen@example.com",
        first_name="Elsa",
        last_name="Frozen",
        hashed_password=bcrypt_context.hash("1ceQu33n#"),
        role_id="2",
    ),
    Users(
        username="tony",
        email="tony.stark@example.com",
        first_name="Tony",
        last_name="Stark",
        hashed_password=bcrypt_context.hash("!r0nM@n123"),
        role_id="2",
    ),
    Users(
        username="bruce",
        email="bruce.wayne@example.com",
        first_name="Bruce",
        last_name="Wayne",
        hashed_password=bcrypt_context.hash("B@tm4n$"),
        role_id="2",
    ),
    Users(
        username="clark",
        email="clark.kent@example.com",
        first_name="Clark",
        last_name="Kent",
        hashed_password=bcrypt_context.hash("Sup3rm@n!"),
        role_id="1",
    ),
    Users(
        username="diana",
        email="diana.prince@example.com",
        first_name="Diana",
        last_name="Prince",
        hashed_password=bcrypt_context.hash("W0nd3rW@man#"),
        role_id="1",
    ),
    Users(
        username="peter",
        email="peter.parker@example.com",
        first_name="Peter",
        last_name="Parker",
        hashed_password=bcrypt_context.hash("Sp1d3yW3b!"),
        role_id="1",
    ),
    Users(
        username="harry",
        email="harry.potter@example.com",
        first_name="Harry",
        last_name="Potter",
        hashed_password=bcrypt_context.hash("M@gicAlw@ys"),
        role_id="1",
    ),
]

data_projects = [
    Projects(
        title="First Sample Project",
        description="This is a test project designed for testing purposes",
        owner_id=1
    ),
    Projects(
        title="Johnny Bravo's Chick Detector",
        description="Gathering labeled images of women for Johnny Bravo's AI-powered chick detector tool.",
        owner_id=1
    ),
    Projects(
        title="ACME Wildlife Tracker",
        description="Collecting images of desert animals to enhance ACME's tracking devices for Wile E. Coyote.",
        owner_id=2
    ),
    Projects(
        title="Scooby Snacks Identifier",
        description="Building a dataset of Scooby Snacks images for training snack detection AI.",
        owner_id=3
    ),
    Projects(
        title="Elsa's Ice Crystal Mapper",
        description="Compiling a dataset of ice crystal patterns to help Elsa design snowflakes.",
        owner_id=4
    ),
    Projects(
        title="Duckburg Artifact Scanner",
        description="Creating a labeled image library of treasures and artifacts for Scrooge McDuck's vault inventory system.",
        owner_id=5
    )
]

data_projects_users = [
    ProjectUsers(
        project_id = 1,
        user_id = 1,
        role_id = 1
    ),
    ProjectUsers(
        project_id = 1,
        user_id = 3,
        role_id = 2
    ),
    ProjectUsers(
        project_id = 2,
        user_id = 1,
        role_id = 1
    ),
    ProjectUsers(
        project_id = 3,
        user_id = 2,
        role_id = 1
    ),
    ProjectUsers(
        project_id = 4,
        user_id = 3,
        role_id = 1
    ),
    ProjectUsers(
        project_id = 5,
        user_id = 4,
        role_id = 1
    ),
    ProjectUsers(
        project_id = 6,
        user_id = 5,
        role_id = 1
    )
]
