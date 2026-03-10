class MeetupEvent {
  final String id;
  final String title;
  final String sport;
  final String locationName;
  final DateTime date;
  final int participantsCount;
  final int maxParticipants;
  final String hostName;

  MeetupEvent({
    required this.id,
    required this.title,
    required this.sport,
    required this.locationName,
    required this.date,
    required this.participantsCount,
    required this.maxParticipants,
    required this.hostName,
  });
}
