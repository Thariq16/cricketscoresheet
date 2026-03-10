import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:firebase_auth/firebase_auth.dart';
import '../../providers/auth_provider.dart';
import '../../widgets/custom_text_field.dart';
import '../../widgets/primary_button.dart';
import '../../theme/app_colors.dart';
import '../../models/user_model.dart';
// Note: In a full app, we would import an api_service to handle the actual HTTP request
// similar to `sendHttpRequest` in React. For now we simulate the integration with Riverpod.

class LoginScreen extends ConsumerStatefulWidget {
  const LoginScreen({super.key});

  @override
  ConsumerState<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends ConsumerState<LoginScreen> {
  final _emailPhoneController = TextEditingController();
  final _passwordController = TextEditingController();
  
  bool _isLoading = false;
  String? _emailPhoneError;
  String? _passwordError;

  bool _isEmail(String email) {
    final re = RegExp(r'^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$');
    return re.hasMatch(email.toLowerCase());
  }

  bool _isContactNo(String contactNo) {
    final re = RegExp(r'^(?:0|94|\+94|0094)?(?:(11|21|23|24|25|26|27|31|32|33|34|35|36|37|38|41|45|47|51|52|54|55|57|63|65|66|67|81|91)(0|2|3|4|5|7|9)|7(0|1|2|4|5|6|7|8)\d)\d{6}$');
    return re.hasMatch(contactNo);
  }

  Future<void> _handleLogin() async {
    setState(() {
      _emailPhoneError = null;
      _passwordError = null;
    });

    final emailPhone = _emailPhoneController.text.trim();
    final password = _passwordController.text.trim();

    if (emailPhone.isEmpty) {
      setState(() => _emailPhoneError = "Enter your Email or Phone Number");
      return;
    }
    if (password.isEmpty) {
      setState(() => _passwordError = "Enter your Password");
      return;
    }

    if (emailPhone.contains('@')) {
      if (!_isEmail(emailPhone)) {
        setState(() => _emailPhoneError = "Please enter a valid email address");
        return;
      }
    } else {
      if (!_isContactNo(emailPhone)) {
        setState(() => _emailPhoneError = "Please enter a valid contact number");
        return;
      }
    }

    setState(() => _isLoading = true);

    try {
      // Here you would call your Dio/Http service to your backend:
      // final response = await apiService.post('/auth/login', data: {...});
      // Mocking successful response for architecture demonstration
      await Future.delayed(const Duration(seconds: 2));
      
      final mockUser = UserModel(id: 'mock_id_123', email: emailPhone);
      
      await ref.read(authProvider.notifier).login('mock_token', mockUser.id, mockUser);
      
      if (!mounted) return;
      // Navigate to Home
      // context.go('/home');
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Login Successful!')),
      );

    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(e.toString()), backgroundColor: Colors.red),
      );
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  Future<void> _handleGoogleLogin() async {
    setState(() => _isLoading = true);
    try {
      final googleProvider = GoogleAuthProvider();
      final userCredential = await FirebaseAuth.instance.signInWithPopup(googleProvider);
      
      if (userCredential.user != null) {
        final googleUser = userCredential.user!;
        
        final mockUser = UserModel(
          id: googleUser.uid, 
          email: googleUser.email, 
          firstName: googleUser.displayName
        );
        
        await ref.read(authProvider.notifier).login('mock_google_token', mockUser.id, mockUser);
        
        if (!mounted) return;
        // Navigate
        // context.go('/home');
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Google Login Successful!')),
        );
      }
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Google Sign-In Failed: $e'), backgroundColor: Colors.red),
      );
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.primaryWhite,
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(24.0),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                // Mock Logo placement
                const Icon(Icons.sports_soccer, size: 80, color: AppColors.primary),
                const SizedBox(height: 24),
                
                Text(
                  "Log In",
                  style: Theme.of(context).textTheme.displayMedium?.copyWith(
                    color: AppColors.primary,
                    fontSize: 28,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  "Please enter your login details below.",
                  style: Theme.of(context).textTheme.bodyMedium,
                ),
                const SizedBox(height: 32),

                CustomTextField(
                  controller: _emailPhoneController,
                  label: "Email / Contact No. (7xxxxxxxx)",
                  errorText: _emailPhoneError,
                ),
                const SizedBox(height: 16),
                
                CustomTextField(
                  controller: _passwordController,
                  label: "Password",
                  isPassword: true,
                  errorText: _passwordError,
                ),
                const SizedBox(height: 16),
                
                Align(
                  alignment: Alignment.centerLeft,
                  child: TextButton(
                    onPressed: () {
                      // Navigate to Forgot Password
                    },
                    child: const Text("Forgot password?"),
                  ),
                ),
                const SizedBox(height: 24),

                PrimaryButton(
                  text: "Login",
                  isLoading: _isLoading,
                  onPressed: _handleLogin,
                ),
                
                const SizedBox(height: 32),
                const Row(
                  children: [
                    Expanded(child: Divider()),
                    Padding(
                      padding: EdgeInsets.symmetric(horizontal: 16.0),
                      child: Text("Or continue with"),
                    ),
                    Expanded(child: Divider()),
                  ],
                ),
                const SizedBox(height: 32),

                OutlinedButton.icon(
                  onPressed: _isLoading ? null : _handleGoogleLogin,
                  icon: const Icon(Icons.g_mobiledata, size: 32),
                  label: const Text("Sign in with Google"),
                  style: OutlinedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(vertical: 12),
                    side: const BorderSide(color: AppColors.primary400),
                    foregroundColor: AppColors.textPrimary,
                  ),
                ),

                const SizedBox(height: 32),
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Text("New user?"),
                    TextButton(
                      onPressed: () {
                        // Navigate to register
                      },
                      child: const Text("Register", style: TextStyle(fontWeight: FontWeight.bold)),
                    ),
                  ],
                )
              ],
            ),
          ),
        ),
      ),
    );
  }
}
