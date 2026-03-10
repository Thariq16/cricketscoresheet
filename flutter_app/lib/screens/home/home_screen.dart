import 'package:flutter/material.dart';
import 'package:geolocator/geolocator.dart';
import '../../services/location_service.dart';
import '../../theme/app_colors.dart';
import '../../models/meetup_event.dart';
import 'package:intl/intl.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  String _currentLocation = "Getting location...";
  bool _isLoadingLocation = true;
  String _selectedSport = "All";

  final List<String> _sports = ["All", "Cricket", "Football", "Padel"];

  // Dummy events for MVP UI
  final List<MeetupEvent> _allEvents = [
    MeetupEvent(
      id: '1', title: 'Weekend T20 Bash', sport: 'Cricket',
      locationName: 'Central Maidan', date: DateTime.now().add(const Duration(days: 1, hours: 2)),
      participantsCount: 18, maxParticipants: 22, hostName: 'Rahul K.',
    ),
    MeetupEvent(
      id: '2', title: '5v5 Evening Turf', sport: 'Football',
      locationName: 'Kickoff Arena', date: DateTime.now().add(const Duration(hours: 4)),
      participantsCount: 8, maxParticipants: 10, hostName: 'Alex M.',
    ),
    MeetupEvent(
      id: '3', title: 'Beginner Padel Session', sport: 'Padel',
      locationName: 'City Padel Club', date: DateTime.now().add(const Duration(days: 2)),
      participantsCount: 2, maxParticipants: 4, hostName: 'Sarah J.',
    ),
    MeetupEvent(
      id: '4', title: 'Sunday League Prep', sport: 'Football',
      locationName: 'Municipal Stadium', date: DateTime.now().add(const Duration(days: 4)),
      participantsCount: 20, maxParticipants: 22, hostName: 'Coach Dave',
    ),
  ];

  @override
  void initState() {
    super.initState();
    _fetchLocation();
  }

  Future<void> _fetchLocation() async {
    try {
      Position? position = await LocationService.getCurrentPosition();
      if (position != null) {
        String address = await LocationService.getAddressFromCoordinates(position.latitude, position.longitude);
        if (mounted) {
          setState(() {
            _currentLocation = address;
            _isLoadingLocation = false;
          });
        }
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _currentLocation = "Location unavailable";
          _isLoadingLocation = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    // Filter events
    final filteredEvents = _selectedSport == "All" 
        ? _allEvents 
        : _allEvents.where((e) => e.sport == _selectedSport).toList();

    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: CustomScrollView(
          physics: const BouncingScrollPhysics(),
          slivers: [
            _buildAppBar(),
            _buildSportsFilter(),
            _buildHeader("Upcoming Nearby"),
            _buildEventsList(filteredEvents),
          ],
        ),
      ),
    );
  }

  SliverToBoxAdapter _buildAppBar() {
    return SliverToBoxAdapter(
      child: Padding(
        padding: const EdgeInsets.fromLTRB(24, 24, 24, 16),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  "Your Location",
                  style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                    fontSize: 12,
                    color: AppColors.textSecondary,
                  ),
                ),
                const SizedBox(height: 4),
                Row(
                  children: [
                    const Icon(Icons.location_on, color: AppColors.primary, size: 20),
                    const SizedBox(width: 4),
                    _isLoadingLocation
                        ? const SizedBox(
                            width: 12, height: 12, 
                            child: CircularProgressIndicator(strokeWidth: 2, color: AppColors.primary))
                        : Text(
                            _currentLocation,
                            style: Theme.of(context).textTheme.displayMedium?.copyWith(
                              fontSize: 16,
                            ),
                          ),
                    const Icon(Icons.keyboard_arrow_down, color: AppColors.primary),
                  ],
                ),
              ],
            ),
            const CircleAvatar(
              backgroundColor: AppColors.primary100,
              radius: 20,
              child: Icon(Icons.person, color: AppColors.primary), // Future profile image
            )
          ],
        ),
      ),
    );
  }

  SliverToBoxAdapter _buildSportsFilter() {
    return SliverToBoxAdapter(
      child: SizedBox(
        height: 50,
        child: ListView.builder(
          scrollDirection: Axis.horizontal,
          padding: const EdgeInsets.symmetric(horizontal: 16),
          itemCount: _sports.length,
          itemBuilder: (context, index) {
            final sport = _sports[index];
            final isSelected = _selectedSport == sport;
            return Padding(
              padding: const EdgeInsets.symmetric(horizontal: 8),
              child: ChoiceChip(
                label: Text(sport),
                selected: isSelected,
                selectedColor: AppColors.primary,
                labelStyle: TextStyle(
                  color: isSelected ? Colors.white : AppColors.textPrimary,
                  fontWeight: isSelected ? FontWeight.bold : FontWeight.normal
                ),
                backgroundColor: AppColors.primaryWhite,
                side: BorderSide(color: isSelected ? AppColors.primary : AppColors.primary200),
                onSelected: (selected) {
                  setState(() {
                    _selectedSport = sport;
                  });
                },
              ),
            );
          },
        ),
      ),
    );
  }

  SliverToBoxAdapter _buildHeader(String title) {
    return SliverToBoxAdapter(
      child: Padding(
        padding: const EdgeInsets.fromLTRB(24, 24, 24, 8),
        child: Text(
          title,
          style: Theme.of(context).textTheme.displayMedium?.copyWith(fontSize: 20),
        ),
      ),
    );
  }

  SliverPadding _buildEventsList(List<MeetupEvent> events) {
    if (events.isEmpty) {
      return SliverPadding(
        padding: const EdgeInsets.all(24),
        sliver: SliverToBoxAdapter(
          child: Center(
            child: Column(
              children: [
                const Icon(Icons.event_busy, size: 64, color: AppColors.primary300),
                const SizedBox(height: 16),
                Text("No meetups found for $_selectedSport in your area.", 
                  style: const TextStyle(color: AppColors.textSecondary)),
                const SizedBox(height: 16),
                ElevatedButton(
                  onPressed: () {},
                  child: const Text("Host an Event"),
                )
              ],
            ),
          ),
        ),
      );
    }

    return SliverPadding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      sliver: SliverList(
        delegate: SliverChildBuilderDelegate(
          (context, index) {
            final event = events[index];
            return _EventCard(event: event);
          },
          childCount: events.length,
        ),
      ),
    );
  }
}

class _EventCard extends StatelessWidget {
  final MeetupEvent event;

  const _EventCard({required this.event});

  IconData _getSportIcon(String sport) {
    switch (sport.toLowerCase()) {
      case 'football': return Icons.sports_soccer;
      case 'cricket': return Icons.sports_cricket;
      case 'padel': return Icons.sports_tennis;
      default: return Icons.sports;
    }
  }

  @override
  Widget build(BuildContext context) {
    final bool isFull = event.participantsCount >= event.maxParticipants;
    
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        color: AppColors.primaryWhite,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.05),
            offset: const Offset(0, 4),
            blurRadius: 10,
          )
        ],
      ),
      child: Material(
        color: Colors.transparent,
        borderRadius: BorderRadius.circular(16),
        child: InkWell(
          borderRadius: BorderRadius.circular(16),
          onTap: () {
            // Navigate to Event Details
          },
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(10),
                      decoration: BoxDecoration(
                        color: AppColors.primary50,
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Icon(_getSportIcon(event.sport), color: AppColors.primary),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            event.title,
                            style: Theme.of(context).textTheme.displayMedium?.copyWith(
                              fontSize: 16,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            "Hosted by ${event.hostName}",
                            style: Theme.of(context).textTheme.bodyMedium?.copyWith(fontSize: 12),
                          )
                        ],
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                      decoration: BoxDecoration(
                        color: isFull ? Colors.redAccent.withValues(alpha: 0.1) : AppColors.secondary500.withValues(alpha: 0.1),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Text(
                        isFull ? "FULL" : "OPEN",
                        style: TextStyle(
                          color: isFull ? Colors.redAccent : AppColors.secondary500,
                          fontWeight: FontWeight.bold,
                          fontSize: 10,
                        ),
                      ),
                    )
                  ],
                ),
                const SizedBox(height: 16),
                Row(
                  children: [
                    const Icon(Icons.calendar_today, size: 14, color: AppColors.textSecondary),
                    const SizedBox(width: 6),
                    Text(
                      DateFormat('EEE, MMM d • h:mm a').format(event.date),
                      style: const TextStyle(color: AppColors.textSecondary, fontSize: 13),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Row(
                      children: [
                        const Icon(Icons.location_on_outlined, size: 14, color: AppColors.textSecondary),
                        const SizedBox(width: 6),
                        Text(
                          event.locationName,
                          style: const TextStyle(color: AppColors.textSecondary, fontSize: 13),
                        ),
                      ],
                    ),
                    Row(
                      children: [
                        const Icon(Icons.group_outlined, size: 14, color: AppColors.textSecondary),
                        const SizedBox(width: 6),
                        Text(
                          "${event.participantsCount}/${event.maxParticipants}",
                          style: TextStyle(
                            color: isFull ? Colors.redAccent : AppColors.secondary500,
                            fontWeight: FontWeight.bold,
                            fontSize: 13,
                          ),
                        ),
                      ],
                    )
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
