# Configuration file for the Sphinx documentation builder.
#
# For the full list of built-in configuration values, see the documentation:
# https://www.sphinx-doc.org/en/master/usage/configuration.html

# -- Project information -----------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#project-information

project = 'Talaria 6'
copyright = '© 2026 InnoPhase IoT, Inc.'
author = 'Innophase IoT, Inc.'

version = '1.0'
release = '1.0'

# -- General configuration ---------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#general-configuration

extensions = [
    'sphinx.ext.autodoc',
    'sphinx_rtd_theme',
]

templates_path = ['_templates']
exclude_patterns = []



# -- Options for HTML output -------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#options-for-html-output

html_theme = 'sphinx_rtd_theme'
html_static_path = ['_static']

html_theme_options = {
    #'display_version': True,      # Keeps the version number
    'prev_next_buttons_location': 'bottom',
    'style_external_links': False,
    # These two lines hide the "View page source" and GitHub links
    'vcs_pageview_mode': '',
}

# This specifically removes the "View page source" link from the top right
html_show_sourcelink = False
