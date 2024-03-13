import requests
import time


BASE_URL = "http://localhost:3000"
session = requests.Session()

def login(email, password):
    url = f"{BASE_URL}/login"
    data = {'email': email, 'password': password}
    response = session.post(url, json=data)
    time.sleep(1)
    if response.status_code == 200:
        print("Login successful!")
        print("Token set in cookie:", response.cookies.get('token'))
    else:
        print("Login failed:", response.json().get('message'))

def register(username, email, password):
    url = f"{BASE_URL}/register"
    data = {'username': username, 'email': email, 'password': password}
    response = session.post(url, json=data)
    time.sleep(1)
    if response.status_code == 201:
        print("Registration successful!")
        
        print("Token set in cookie:", response.cookies.get('token'))
    else:
        print("Registration failed:", response.json().get('message'))
    

def add_task(title, description, due_date):
    url = f"{BASE_URL}/tasks"
    data = {'name': title, 'description': description, 'dueDate': due_date}
    response = session.post(url, json=data)
    time.sleep(1)
    if response.ok:
        print("Task added successfully!")
    else:
        print("Failed to add task:", response.text)

def view_tasks():
    url = f"{BASE_URL}/tasks"
    response = session.get(url)
    time.sleep(1)
    if response.ok:
        tasks = response.json()
        print("Tasks:", tasks)
    else:
        print("Failed to retrieve tasks:", response.text)

def update_task(task_id, name, dueDate, completed):
    url = f"{BASE_URL}/tasks/{task_id}"
    data = {'name': name, 'dueDate': dueDate, 'completed': completed}
    response = session.patch(url, json=data)
    time.sleep(1)
    if response.status_code == 200:
        print("Task updated successfully!", response.json())
    else:
        print("Failed to update task:", response.json().get('message'))

def delete_task(task_id):
    url = f"{BASE_URL}/tasks/{task_id}"
    response = session.delete(url)
    time.sleep(1)
    if response.status_code == 200:
        print("Task deleted successfully!")
    else:
        print("Failed to delete task:", response.json().get('message'))

def logout():
    url = f"{BASE_URL}/logout"
    response = session.post(url)
    time.sleep(1)
    if response.ok:
        print("Logged out successfully!")
    else:
        print("Logout failed:", response.text)



email = "test1@mail.com"
password = "passcode"
login(email, password)

add_task("New Task", "This is a new task", "2024-02-20")
view_tasks()
logout()


# Register new user
new_username_2 = "user_3"
new_email_2 = "user3@test.com"
new_password_2 = "securepass"
register(new_username_2, new_email_2, new_password_2)

# Login with the new user
login(new_email_2, new_password_2)

# Add multiple tasks for the new user
add_task("task1","Read a book", "2024-03-01")
add_task("task2","Go for a run", "2024-03-02")
add_task("task3","Plan vacation", "2024-03-05")


view_tasks()



tasks_for_user_2 = view_tasks()
if tasks_for_user_2:
    task_to_update = tasks_for_user_2[0]['_id']
    update_task(task_to_update, "Read two books", "2024-03-03", False)

    # Delete the second task
    if len(tasks_for_user_2) > 1:
        task_to_delete = tasks_for_user_2[1]['_id']
        delete_task(task_to_delete)

# View tasks again to verify the update and deletion
view_tasks()





logout()



