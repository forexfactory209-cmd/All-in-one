const usersRepository = require('./users.repository');

class UsersService {
    async getAllUsers() {
        return await usersRepository.findAll();
    }

    async getUserById(id) {
        return await usersRepository.findById(id);
    }

    async getUserByEmail(email) {
        return await usersRepository.findByEmail(email);
    }

    async getUserByPhone(phone) {
        return await usersRepository.findByPhone(phone);
    }

    async createUser(userData) {
        // Here we could add password hashing if it were a full auth implementation
        return await usersRepository.create(userData);
    }

    async updateUser(id, userData) {
        return await usersRepository.update(id, userData);
    }

    async deleteUser(id) {
        return await usersRepository.delete(id);
    }
}

module.exports = new UsersService();
