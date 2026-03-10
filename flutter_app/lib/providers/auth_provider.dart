import 'dart:convert';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/user_model.dart';
import 'package:firebase_auth/firebase_auth.dart';

// Represents the state object analogous to the Context React State
class AuthState {
  final bool isAuthenticated;
  final UserModel? userInfo;
  final bool isLoading;
  final String? error;

  AuthState({
    this.isAuthenticated = false,
    this.userInfo,
    this.isLoading = false,
    this.error,
  });

  AuthState copyWith({
    bool? isAuthenticated,
    UserModel? userInfo,
    bool? isLoading,
    String? error,
  }) {
    return AuthState(
      isAuthenticated: isAuthenticated ?? this.isAuthenticated,
      userInfo: userInfo ?? this.userInfo,
      isLoading: isLoading ?? this.isLoading,
      error: error,
    );
  }
}

class AuthNotifier extends Notifier<AuthState> {
  @override
  AuthState build() {
    _loadStoredSession();
    return AuthState(isLoading: true);
  }

  Future<void> _loadStoredSession() async {
    final prefs = await SharedPreferences.getInstance();
    final storedUserId = prefs.getString('loggedInUserId');
    final storedUserInfoStr = prefs.getString('userInfo');

    if (storedUserId != null && storedUserInfoStr != null) {
      final userInfoMap = jsonDecode(storedUserInfoStr);
      final userInfo = UserModel.fromJson(userInfoMap);
      state = state.copyWith(
        isAuthenticated: true,
        userInfo: userInfo,
        isLoading: false,
      );
    } else {
      state = state.copyWith(isLoading: false);
    }
  }

  Future<void> login(String token, String userId, UserModel userInfo) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('loggedInUserToken', token);
    await prefs.setString('loggedInUserId', userId);
    await prefs.setString('showIntroScreen', 'true');
    await prefs.setString('userInfo', jsonEncode(userInfo.toJson()));

    state = state.copyWith(
      isAuthenticated: true,
      userInfo: userInfo,
      isLoading: false,
    );
  }

  Future<void> updateUserInfo(UserModel updatedInfo) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('userInfo', jsonEncode(updatedInfo.toJson()));
    state = state.copyWith(userInfo: updatedInfo);
  }

  Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('loggedInUserToken');
    await prefs.remove('loggedInUserId');
    await prefs.remove('showIntroScreen');
    await prefs.remove('userInfo');
    
    // Sign out of Firebase
    try {
      await FirebaseAuth.instance.signOut();
    } catch (e) {
      // Handle or ignore sign out errors
    }

    state = AuthState(isAuthenticated: false, userInfo: null, isLoading: false);
  }
}

final authProvider = NotifierProvider<AuthNotifier, AuthState>(() {
  return AuthNotifier();
});
