```mermaid
graph TD;
    A[views.py] -->|uses| B[db_helpers.py];
    A -->|uses| C[forms.py];
    A -->|uses| D[models.py];
    A -->|uses| E[urls.py];
    A -->|uses| F[templates/];
    A -->|uses| G[external_api_helpers.py];

    B -->|imports| D[models.py];

    subgraph "Django App"
        A
        B
        C
        D
        E
        F
        G
    end
