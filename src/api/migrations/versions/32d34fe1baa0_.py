"""empty message

Revision ID: 32d34fe1baa0
Revises: None
Create Date: 2015-04-01 23:46:44.169130

"""

# revision identifiers, used by Alembic.
revision = '32d34fe1baa0'
down_revision = None

from alembic import op
import sqlalchemy as sa

def upgrade():
    conn = op.get_bind()
    conn.execute("""
    CREATE TABLE  users (
    id		     VARCHAR(32),
    username         VARCHAR(32),
    name	     TEXT NOT NULL,
    email	     TEXT NOT NULL,
    password_hash    TEXT NOT NULL,
    created          DATETIME NOT NULL,
    updated          DATETIME,
    PRIMARY KEY(id),
    UNIQUE(username)
    );
    """)

    conn.execute("""
    CREATE TABLE user_locations (
    user_id           VARCHAR(32) REFERENCES users(id),
    lat               FLOAT NOT NULL,
    long              FLOAT NOT NULL,
    created_at        DATETIME NOT NULL,
    PRIMARY KEY(user_id, created_at)
    );
    """)

    conn.execute("""
    CREATE TABLE  questions (
    id		 VARCHAR(32) NOT NULL,
    question	 TEXT NOT NULL,
    PRIMARY KEY(id),
    UNIQUE(question)
    );
    """)

    conn.execute("""
    CREATE TABLE  locations(
    id          INTEGER AUTO_INCREMENT,
    name 	VARCHAR(125) NOT NULL,
    lat		VARCHAR(10) NOT NULL,
    long	VARCHAR(10) NOT NULL,
    PRIMARY KEY(id)
    );
    """)

    conn.execute("""
    CREATE TABLE  answers (
    id             VARCHAR(32) NOT NULL,
    selfie_id      VARCHAR(32) REFERENCES selfies(id),
    question_id    VARCHAR(32) REFERENCES questions(id),
    user_id        VARCHAR(32) REFERENCES users(id),
    answer         TEXT NOT NULL,
    created        DATETIME NOT NULL,
    PRIMARY KEY(id)
    );
    """)

    conn.execute("""
    CREATE TABLE  ratings (
    selfie_id 	VARCHAR(32) REFERENCES selfies(id),
    rater_id	VARCHAR(32) REFERENCES users(id),
    ratee_id	VARCHAR(32) REFERENCES users(id),
    rating      INTEGER NOT NULL,
    created 	DATETIME NOT NULL,
    PRIMARY KEY(selfie_id, rater_id, ratee_id)
    );
    """)

    conn.execute("""
    CREATE TABLE  selfie_users (
    selfie_id VARCHAR(32),
    user_id VARCHAR(32) REFERENCES users(id),
    PRIMARY KEY(selfie_id, user_id)
    );
    """)

    conn.execute("""
    CREATE TABLE  selfies (
    id		   VARCHAR(32),
    outcome_id	   INTEGER,
    proposal_id    INTEGER,
    created 	   DATETIME NOT NULL,
    PRIMARY KEY(id)
    );
    """)

    conn.execute("""
    CREATE TABLE  feedback (
    user_id 	VARCHAR(32) REFERENCES users(id),
    selfie_id 	VARCHAR(32) REFERENCES selfies(id),
    feedback 	TEXT NOT NULL,
    created 	DATETIME NOT NULL,
    PRIMARY KEY(user_id, selfie_id)
    );
    """)

    conn.execute("""
    CREATE TABLE  outcome_codes (
    outcomeid	   VARCHAR(32),
    description    TEXT NOT NULL,
    PRIMARY KEY(outcomeid),
    UNIQUE(description)
    );
    """)

    conn.execute("""
    CREATE TABLE  proposals (
    id		   VARCHAR(32),
    proposer_id	   VARCHAR(32) REFERENCES users(id),
    recipient_id   VARCHAR(32) REFERENCES users(id),
    location	   POINT,
    meeting_time   DATETIME,
    accepted	   BOOLEAN,
    created        DATETIME,
    PRIMARY KEY(id)
    );
    """)

def downgrade():
    conn = op.get_bind()
    conn.execute("DROP TABLE users")
    conn.execute("DROP TABLE user_locations")
    conn.execute("DROP TABLE questions")
    conn.execute("DROP TABLE locations")
    conn.execute("DROP TABLE answers")
    conn.execute("DROP TABLE ratings")
    conn.execute("DROP TABLE selfie_users")
    conn.execute("DROP TABLE selfies")
    conn.execute("DROP TABLE feedback")
    conn.execute("DROP TABLE outcome_codes")
    conn.execute("DROP TABLE proposals")
