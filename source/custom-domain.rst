Setting up a Custom Domain
==========================

To remove ``readthedocs.io`` from your documentation URL (e.g., change ``talaria-6.readthedocs.io`` to ``docs.yourcompany.com``), you must configure a Custom Domain.

1.  **Configure DNS**:
    
    Log in to your DNS provider (e.g., GoDaddy, AWS Route53, Namecheap) and create a **CNAME** record:
    
    *   **Name**: ``docs`` (or your desired subdomain)
    *   **Value**: ``readthedocs.io``

2.  **Configure ReadTheDocs**:

    *   Go to your project dashboard on ReadTheDocs.
    *   Navigate to **Admin** > **Domains**.
    *   Enter your custom domain (e.g., ``docs.yourcompany.com``).
    *   Check the **Canonical** box to ensure search engines index this URL.
    *   Click **Add**.

3.  **Update Configuration**:
    
    Once your domain is active, update the ``html_baseurl`` in ``source/conf.py``:

    .. code-block:: python

       html_baseurl = 'https://docs.yourcompany.com/'

For detailed instructions, see the `ReadTheDocs Custom Domains documentation <https://docs.readthedocs.io/en/stable/custom_domains.html>`_.
