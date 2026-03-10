import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../providers/auth_provider.dart';
import '../../theme/app_colors.dart';
import '../auth/login_screen.dart';

class ProfileScreen extends ConsumerStatefulWidget {
  const ProfileScreen({super.key});

  @override
  ConsumerState<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends ConsumerState<ProfileScreen> {
  final List<String> _selectedSports = ["Cricket"];
  final List<String> _availableSports = ["Cricket", "Football", "Padel", "Tennis", "Basketball"];

  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(authProvider);
    final user = authState.userInfo;

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text("Profile"),
        centerTitle: true,
        backgroundColor: AppColors.background,
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.settings_outlined, color: AppColors.textPrimary),
            onPressed: () {},
          )
        ],
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              // Avatar
              Center(
                child: Stack(
                  children: [
                    CircleAvatar(
                      radius: 50,
                      backgroundColor: AppColors.primary100,
                      backgroundImage: user?.profilePhoto != null
                          ? NetworkImage(user!.profilePhoto!)
                          : null,
                      child: user?.profilePhoto == null
                          ? const Icon(Icons.person, size: 50, color: AppColors.primary)
                          : null,
                    ),
                    Positioned(
                      bottom: 0,
                      right: 0,
                      child: Container(
                        padding: const EdgeInsets.all(4),
                        decoration: const BoxDecoration(
                          color: AppColors.primary,
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(Icons.edit, size: 16, color: Colors.white),
                      ),
                    )
                  ],
                ),
              ),
              const SizedBox(height: 16),
              Text(
                user?.firstName ?? "User",
                style: Theme.of(context).textTheme.displayMedium?.copyWith(fontSize: 24),
              ),
              const SizedBox(height: 4),
              Text(
                user?.location ?? "Set your location",
                style: const TextStyle(color: AppColors.textSecondary, fontSize: 14),
              ),
              
              const SizedBox(height: 32),
              
              // Sports Preferences
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: AppColors.primaryWhite,
                  borderRadius: BorderRadius.circular(16),
                  boxShadow: [
                    BoxShadow(color: Colors.black.withValues(alpha: 0.05), blurRadius: 10, offset: const Offset(0, 4))
                  ],
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text("My Sports", style: Theme.of(context).textTheme.displayMedium?.copyWith(fontSize: 18)),
                    const SizedBox(height: 16),
                    Wrap(
                      spacing: 8,
                      runSpacing: 8,
                      children: _availableSports.map((sport) {
                        final isSelected = _selectedSports.contains(sport);
                        return FilterChip(
                          label: Text(sport),
                          selected: isSelected,
                          onSelected: (selected) {
                            setState(() {
                              if (selected) {
                                _selectedSports.add(sport);
                              } else {
                                _selectedSports.remove(sport);
                              }
                            });
                          },
                          selectedColor: AppColors.primary.withValues(alpha: 0.2),
                          checkmarkColor: AppColors.primary,
                          labelStyle: TextStyle(
                            color: isSelected ? AppColors.primary : AppColors.textPrimary,
                            fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                          ),
                          backgroundColor: AppColors.background,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(20),
                            side: BorderSide(color: isSelected ? AppColors.primary : AppColors.primary200),
                          ),
                        );
                      }).toList(),
                    ),
                  ],
                ),
              ),
              
              const SizedBox(height: 24),
              
              // Stats
              Row(
                children: [
                  _buildStatCard("Games", "12"),
                  const SizedBox(width: 16),
                  _buildStatCard("Teams", "2"),
                ],
              ),
              
              const SizedBox(height: 32),
              
              // Logout Button
              SizedBox(
                width: double.infinity,
                child: OutlinedButton.icon(
                  onPressed: () async {
                    await ref.read(authProvider.notifier).logout();
                    if (context.mounted) {
                      Navigator.of(context).pushAndRemoveUntil(
                        MaterialPageRoute(builder: (context) => const LoginScreen()),
                        (route) => false,
                      );
                    }
                  },
                  icon: const Icon(Icons.logout, color: Colors.redAccent),
                  label: const Text("Log Out", style: TextStyle(color: Colors.redAccent)),
                  style: OutlinedButton.styleFrom(
                    side: const BorderSide(color: Colors.redAccent),
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                ),
              )
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildStatCard(String title, String value) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: AppColors.primaryWhite,
          borderRadius: BorderRadius.circular(16),
          boxShadow: [
            BoxShadow(color: Colors.black.withValues(alpha: 0.05), blurRadius: 10, offset: const Offset(0, 4))
          ],
        ),
        child: Column(
          children: [
            Text(value, style: Theme.of(context).textTheme.displayMedium?.copyWith(fontSize: 24, color: AppColors.primary)),
            const SizedBox(height: 4),
            Text(title, style: const TextStyle(color: AppColors.textSecondary, fontSize: 12)),
          ],
        ),
      ),
    );
  }
}
