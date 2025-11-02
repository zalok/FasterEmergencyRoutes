const User = require('../domain/user');

class UserService {
  // Inyectamos las dependencias (los puertos)
  constructor(userRepository, passwordService, authService) {
    this.userRepository = userRepository;
    this.passwordService = passwordService;
    this.authService = authService;
  }

  async registerUser(name, email, password, emergencyType, vehicleNumber) {
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error("El usuario ya existe");
    }

    const hashedPassword = await this.passwordService.hash(password);

    const newUser = new User(
      null, name, email, hashedPassword, emergencyType, vehicleNumber
    );

    const savedUser = await this.userRepository.save(newUser);
    return savedUser;
  }

  async loginUser(email, password) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      console.error(`Intento de login fallido: Email ${email} no encontrado.`);
      throw new Error("Credenciales inválidas");
    }

    const isValid = await this.passwordService.compare(password, user.passwordHash);
    if (!isValid) {
      console.error(`Intento de login fallido: Contraseña incorrecta para ${email}.`);
      throw new Error("Credenciales inválidas");
    }

    const token = this.authService.generateToken({
      userId: user.id,
      email: user.email,
      emergencyType: user.emergencyType,
    });

    return { token, user };
  }
}

module.exports = UserService;