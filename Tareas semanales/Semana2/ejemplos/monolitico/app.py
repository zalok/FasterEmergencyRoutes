from flask import Flask, request, jsonify

app = Flask(__name__)

# Base de datos en memoria (simulada)
users_db = {}

@app.route('/users', methods=['POST'])
def create_user():
    data = request.get_json()
    user_id = len(users_db) + 1
    user = {
        'id': user_id,
        'name': data['name'],
        'email': data['email']
    }
    users_db[user_id] = user
    return jsonify(user), 201

@app.route('/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = users_db.get(user_id)
    if user:
        return jsonify(user)
    return jsonify({'error': 'User not found'}), 404

@app.route('/users', methods=['GET'])
def get_all_users():
    return jsonify(list(users_db.values()))



if __name__ == '__main__':
    app.run(debug=True)