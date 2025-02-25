import csv

def read_csv_header(file_path):
    with open(file_path, mode='r', newline='', encoding='utf-8') as file:
        reader = csv.reader(file)
        header = next(reader)  # Read the first row (header)
        return header

# Example usage
file_path = 'C:/Users/Mary Mare/Downloads/books_1.Best_Books_Ever.csv'  # Replace with your actual file path
header = read_csv_header(file_path)
print("CSV Header:", header)