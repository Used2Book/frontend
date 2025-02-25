import requests
import json

def get_book_description(isbn):
    # Build the URL with jscmd=details
    url = f"https://openlibrary.org/api/books?bibkeys=ISBN:{isbn}&format=json&jscmd=details"
    response = requests.get(url)
    
    if response.status_code != 200:
        print("Error fetching data:", response.status_code)
        return None

    data = response.json()
    
    # Access the details section for our ISBN
    book_key = f"ISBN:{isbn}"
    details = data.get(book_key, {}).get("details", {})

    # Extract the description from the details
    description = details.get("description")
    
    # The description can be a dict or a string
    if isinstance(description, dict):
        description = description.get("value", "No description available")
    
    return description

# Example usage:
isbn = "0451526538"
description = get_book_description(isbn)
print("Book Description:")
print(description)
# D:\used2book\used2book-frontend>python open-library-api.py
# Key: ISBN:9780439358071
# Value:
# {
#   "bib_key": "ISBN:9780439358071",
#   "info_url": "https://openlibrary.org/books/OL34152967M/Harry_Potter_and_the_Order_of_the_Phoenix",
#   "preview": "restricted",
#   "preview_url": "https://archive.org/details/harrypotterorder0000rowl_h2t4",
#   "thumbnail_url": "https://covers.openlibrary.org/b/id/14656833-S.jpg",
#   "details": {
#     "works": [
#       {
#         "key": "/works/OL82548W"
#       }
#     ],
#     "title": "Harry Potter and the Order of the Phoenix",
#     "publishers": [
#       "Scholastic Inc."
#     ],
#     "publish_date": "2004-09",
#     "key": "/books/OL34152967M",
#     "type": {
#       "key": "/type/edition"
#     },
#     "identifiers": {
#       "goodreads": [
#         "57451934"
#       ]
#     },
#     "ocaid": "harrypotterorder0000rowl_h2t4",
#     "isbn_10": [
#       "0439358078"
#     ],
#     "isbn_13": [
#       "9780439358071"
#     ],
#     "oclc_numbers": [
#       "56098238",
#       "993116990"
#     ],
#     "lccn": [
#       "2003102525"
#     ],
#     "classifications": {},
#     "languages": [
#       {
#         "key": "/languages/eng"
#       }
#     ],
#     "publish_places": [
#       "New York"
#     ],
#     "copyright_date": "2003",
#     "description": {
#       "type": "/type/text",
#       "value": "There is a door at the end of a silent corridor. And it\u2019s haunting Harry Pottter\u2019s dreams. Why else would he be waking in the middle of the night, screaming in terror?\r\n\r\nHarry has a lot on his mind for this, his fifth year at Hogwarts: a Defense Against the Dark Arts teacher with a personality like poisoned honey; a big surprise on the Gryffindor Quidditch team; and the looming terror of the Ordinary Wizarding Level exams. But all these things pale next to the growing threat of He-Who-Must-Not-Be-Named---a threat that neither the magical government nor the authorities at Hogwarts can stop.\r\n\r\nAs the grasp of darkness tightens, Harry must discover the true depth and strength of his friends, the importance of boundless loyalty, and the shocking price of unbearable sacrifice.\r\n\r\nHis fate depends on them all.\r\n(back cover)"
#     },
#     "edition_name": "First Scholastic trade paperback printing",
#     "pagination": "870p.",
#     "physical_format": "Paperback",
#     "notes": {
#       "type": "/type/text",
#       "value": "US"
#     },
#     "number_of_pages": 870,
#     "covers": [
#       14656833,
#       12025650
#     ],
#     "source_records": [
#       "bwb:9780439358071"
#     ],
#     "latest_revision": 5,
#     "revision": 5,
#     "created": {
#       "type": "/type/datetime",
#       "value": "2021-09-30T15:50:45.005193"
#     },
#     "last_modified": {
#       "type": "/type/datetime",
#       "value": "2024-08-16T12:22:20.725140"
#     }
#   }
# }