```mermaid
graph TD;
    A[base.html] -->|extends| B[list.html]
    A -->|extends| C[top.html]
    A -->|extends| D[new.html]

    B -->|include| E[includes/register_modal_form.html]
    C -->|include| E
    D -->|include| F[includes/search_results_modal.html]

    B --> G[Finished Books Section]
    B --> H[Unfinished Books Section]
    C --> I[Your Reading Books Section]
    C --> J[Other Users' Books Section]
    D --> K[New Book Form Section]

