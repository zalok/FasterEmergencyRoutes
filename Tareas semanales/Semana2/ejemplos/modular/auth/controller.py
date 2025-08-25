from flask import render_template, redirect, url_for, flash, session
from auth.services import AuthService

class AuthController:
    @staticmethod
    def login():
        return render_template('login.html')
    
    @staticmethod
    def login_post():
        username = request.form.get('username')
        password = request.form.get('password')
        
        user, message = AuthService.authenticate_user(username, password)
        
        if user:
            session['user_id'] = user.id
            flash(message, 'success')
            return redirect(url_for('auth.dashboard'))
        else:
            flash(message, 'danger')
            return redirect(url_for('auth.login'))
    
    @staticmethod
    def register():
        return render_template('register.html')
    
    @staticmethod
    def register_post():
        username = request.form.get('username')
        email = request.form.get('email')
        password = request.form.get('password')
        confirm_password = request.form.get('confirm_password')
        
        if password != confirm_password:
            flash('Las contraseñas no coinciden', 'danger')
            return redirect(url_for('auth.register'))
        
        user, message = AuthService.register_user(username, email, password)
        
        if user:
            flash(message, 'success')
            return redirect(url_for('auth.login'))
        else:
            flash(message, 'danger')
            return redirect(url_for('auth.register'))
    
    @staticmethod
    def dashboard():
        if 'user_id' not in session:
            flash('Por favor inicia sesión primero', 'warning')
            return redirect(url_for('auth.login'))
        
        user = AuthService.get_user_by_id(session['user_id'])
        return render_template('dashboard.html', user=user)
    
    @staticmethod
    def logout():
        session.pop('user_id', None)
        flash('Has cerrado sesión exitosamente', 'info')
        return redirect(url_for('auth.login'))