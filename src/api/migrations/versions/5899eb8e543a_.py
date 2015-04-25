"""empty message

Revision ID: 5899eb8e543a
Revises: 18e40fcbb6cf
Create Date: 2015-04-23 21:47:55.183856

"""

# revision identifiers, used by Alembic.
revision = '5899eb8e543a'
down_revision = '18e40fcbb6cf'

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

def upgrade():
    conn = op.get_bind()
    conn.execute("""
    INSERT INTO users (id, username, name, email, password_hash, created, updated, password_salt, role) VALUES ('74e1a6e0-e7ae-11e4-8ca5-080027201064', 'big', 'Big McLargeHuge', 'big@selfiewithstrangers.club', '$2a$12$SaBTy1lCby1gulxotFplae/BMN7JZZDaOUgh4mCRNNLWEkbUi21Je', now(), now(), '$2a$12$SaBTy1lCby1gulxotFplae', 2);
    """)
    conn.execute("""
    INSERT INTO users (id, username, name, email, password_hash, created, updated, password_salt, role) VALUES ('e7aea6e0-e7ae-11e4-8ca5-080027201063', 'thick', 'Thick McRunFast', 'thick@selfiewithstrangers.club', '$2a$12$SaBTy1lCby1gulxotFplae/BMN7JZZDaOUgh4mCRNNLWEkbUi21Je', now(), now(), '$2a$12$SaBTy1lCby1gulxotFplae', 1);
    """)
    conn.execute("""
    INSERT INTO questions (id, question) VALUES ('e3ef2158-e93d-11e4-b183-080027201064', 'If your selfie partner could fight anyone from history, who would it be?');
    """)
    conn.execute("""
    INSERT INTO questions (id, question) VALUES ('28f7ccf2-e941-11e4-96c2-080027201064', 'Does your selfie partner believe in ghosts?');
    """)

def downgrade():
    pass
