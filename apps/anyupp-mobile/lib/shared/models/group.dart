import 'address.dart';
import 'payment.dart';

class Group {
  String chainId;
  String name;
  String email;
  String phone;
  String profileImage;
  Address address;
  Payment payment;
  String description;
  Map<String, String> products;

  Group({
    this.chainId,
    this.name,
    this.email,
    this.phone,
    this.profileImage,
    this.address,
    this.payment,
    this.description,
    this.products,
  });
}
