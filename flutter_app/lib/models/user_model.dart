class UserModel {
  final String id;
  final String? email;
  final String? contactNo;
  final String? firstName;
  final String? lastName;
  final String? profilePhoto;
  final String? location;
  final String? birthDate;
  final String? playingRole;
  final String? battingStyle;
  final String? bowlingStyle;
  final String? gender;

  UserModel({
    required this.id,
    this.email,
    this.contactNo,
    this.firstName,
    this.lastName,
    this.profilePhoto,
    this.location,
    this.birthDate,
    this.playingRole,
    this.battingStyle,
    this.bowlingStyle,
    this.gender,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: json['_id'] ?? '',
      email: json['email'],
      contactNo: json['contactNo'],
      firstName: json['firstName'],
      lastName: json['lastName'],
      profilePhoto: json['profilePhoto'],
      location: json['location'],
      birthDate: json['birthDate'],
      playingRole: json['playingRole'],
      battingStyle: json['battingStyle'],
      bowlingStyle: json['bowlingStyle'],
      gender: json['gender'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      '_id': id,
      'email': email,
      'contactNo': contactNo,
      'firstName': firstName,
      'lastName': lastName,
      'profilePhoto': profilePhoto,
      'location': location,
      'birthDate': birthDate,
      'playingRole': playingRole,
      'battingStyle': battingStyle,
      'bowlingStyle': bowlingStyle,
      'gender': gender,
    };
  }
}
