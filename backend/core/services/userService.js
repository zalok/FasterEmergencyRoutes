const User = require('../domain/user');

class UserService {
  // ... (tu constructor no cambia)
  constructor(userRepository, passwordService, authService) {
    this.userRepository = userRepository;
    this.passwordService = passwordService;
    this.authService = authService;
  }

  async registerUser(name, email, password, emergencyType, vehicleNumber) {
    if (!password) {
      throw new Error("La contraseña es obligatoria.");
    }
    const passwordPolicyRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    
    if (!passwordPolicyRegex.test(password)) {
      throw new Error(
        "La contraseña no cumple con los requisitos: debe tener al menos 8 caracteres, una mayúscula y un número."
      );
    }

    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error("Email No disponible");
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
      console.error(`Intento de login fallido`);
      throw new Error("Credenciales inválidas");
    }

    const isValid = await this.passwordService.compare(password, user.passwordHash);
    if (!isValid) {
      console.error(`Intento de login fallido`);
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