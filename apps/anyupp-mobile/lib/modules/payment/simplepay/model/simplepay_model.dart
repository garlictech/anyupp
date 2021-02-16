import 'dart:convert';

import 'package:fa_prev/shared/utils/enum.dart';
import 'package:intl/intl.dart';

DateFormat formatter = DateFormat('yyyy-MM-dd HH:mm:ss');

enum SimplePayPaymentStatus {
  INIT,
  TIMEOUT,
  CANCELLED,
  NOTAUTHORIZED,
  INPAYMENT,
  INFRAUD,
  AUTHORIZED,
  FRAUD,
  REVERSED,
  REFUND,
  FINISHED,
}

class SimplePayStartResponse {
  final String paymentUrl;
  final String transactionId;

  const SimplePayStartResponse({
    this.paymentUrl,
    this.transactionId,
  });

  @override
  String toString() => 'SimplePayStartResponse(paymentUrl: $paymentUrl, transactionId: $transactionId)';

  Map<String, dynamic> toMap() {
    return {
      'paymentUrl': paymentUrl,
      'transactionId': transactionId,
    };
  }

  factory SimplePayStartResponse.fromMap(Map<String, dynamic> map) {
    if (map == null) return null;

    return SimplePayStartResponse(
      paymentUrl: map['paymentUrl'],
      transactionId: map['transactionId'],
    );
  }

  String toJson() => json.encode(toMap());

  factory SimplePayStartResponse.fromJson(String source) => SimplePayStartResponse.fromMap(json.decode(source));
}

class SimplePayPaymentResult {
  final SimplePayPaymentStatus status;
  final int externalTransactionId;

  const SimplePayPaymentResult({
    this.status,
    this.externalTransactionId,
  });

  @override
  String toString() => 'SimplePayPaymentResult(status: $status, externalTransactionId: $externalTransactionId)';

  factory SimplePayPaymentResult.fromMap(Map<dynamic, dynamic> map) {
    if (map == null || map['status'] == null) return null;

    return SimplePayPaymentResult(
        status: SimplePayPaymentStatus.values.firstWhere((value) => stringFromEnum(value) == map['status']),
        externalTransactionId: map['externalTransactionId']);
  }

  // factory SimplePayPaymentResult.fromJson(String source) => SimplePayPaymentResult.fromMap(json.decode(source));
}

/* 
class SimplePayPayment {
  String salt;
  String merchant;
  String orderRef;
  String currency;
  String customer;
  String customerEmail;
  String language;
  String sdkVersion;
  List<String> methods;
  String total;
  DateTime timeout;
  String url;
  Invoice invoice;
  Invoice delivery;
  CardData cardData;
  String type;
  String threeDSReqAuthMethod;
  bool maySelectEmail;
  bool maySelectInvoice;
  Browser browser;
  bool twoStep;
  MobilApp mobilApp;
  Urls urls;
  double discount;
  double shippingCost;

  SimplePayPayment({
    this.salt,
    this.merchant,
    this.orderRef,
    this.currency,
    this.customer,
    this.customerEmail,
    this.language,
    this.sdkVersion,
    this.methods,
    this.total,
    this.timeout,
    this.url,
    this.invoice,
    this.delivery,
    this.cardData,
    this.type,
    this.threeDSReqAuthMethod,
    this.maySelectEmail,
    this.maySelectInvoice,
    this.browser,
    this.twoStep,
    this.mobilApp,
    this.urls,
    this.discount,
    this.shippingCost,
  });

  Map<String, dynamic> toMap() {
    return {
      'salt': salt,
      'merchant': merchant,
      'orderRef': orderRef,
      'currency': currency,
      'customer': customer,
      'customerEmail': customerEmail,
      'language': language,
      'sdkVersion': sdkVersion,
      'methods': methods,
      'total': total,
      'timeout': timeout?.millisecondsSinceEpoch,
      'url': url,
      'invoice': invoice?.toMap(),
      'delivery': delivery?.toMap(),
      'cardData': cardData?.toMap(),
      'type': type,
      'threeDSReqAuthMethod': threeDSReqAuthMethod,
      'maySelectEmail': maySelectEmail,
      'maySelectInvoice': maySelectInvoice,
      'browser': browser?.toMap(),
      'twoStep': twoStep,
      'mobilApp': mobilApp?.toMap(),
      'urls': urls?.toMap(),
      'discount': discount,
      'shippingCost': shippingCost,
    };
  }

  factory SimplePayPayment.fromMap(Map<String, dynamic> map) {
    if (map == null) return null;

    return SimplePayPayment(
      salt: map['salt'],
      merchant: map['merchant'],
      orderRef: map['orderRef'],
      currency: map['currency'],
      customer: map['customer'],
      customerEmail: map['customerEmail'],
      language: map['language'],
      sdkVersion: map['sdkVersion'],
      methods: List<String>.from(map['methods']),
      total: map['total'],
      timeout: DateTime.fromMillisecondsSinceEpoch(map['timeout']),
      url: map['url'],
      invoice: Invoice.fromMap(map['invoice']),
      delivery: Invoice.fromMap(map['delivery']),
      cardData: CardData.fromMap(map['cardData']),
      type: map['type'],
      threeDSReqAuthMethod: map['threeDSReqAuthMethod'],
      maySelectEmail: map['maySelectEmail'],
      maySelectInvoice: map['maySelectInvoice'],
      browser: Browser.fromMap(map['browser']),
      twoStep: map['twoStep'],
      mobilApp: MobilApp.fromMap(map['mobilApp']),
      urls: Urls.fromMap(map['urls']),
      discount: map['discount'],
      shippingCost: map['shippingCost'],
    );
  }

  String toJson() => json.encode(toMap());

  factory SimplePayPayment.fromJson(String source) => SimplePayPayment.fromMap(json.decode(source));

  @override
  String toString() {
    return 'SimplePayPayment(salt: $salt, merchant: $merchant, orderRef: $orderRef, currency: $currency, customer: $customer, customerEmail: $customerEmail, language: $language, sdkVersion: $sdkVersion, methods: $methods, total: $total, timeout: $timeout, url: $url, invoice: $invoice, delivery: $delivery, cardData: $cardData, type: $type, threeDSReqAuthMethod: $threeDSReqAuthMethod, maySelectEmail: $maySelectEmail, maySelectInvoice: $maySelectInvoice, browser: $browser, twoStep: $twoStep, mobilApp: $mobilApp, urls: $urls, discount: $discount, shippingCost: $shippingCost)';
  }
}

class Invoice {
  String name;
  String company;
  String country;
  String state;
  String city;
  String zip;
  String address;
  String address2;
  String phone;
  Invoice({
    this.name,
    this.company,
    this.country,
    this.state,
    this.city,
    this.zip,
    this.address,
    this.address2,
    this.phone,
  });

  Map<String, dynamic> toMap() {
    return {
      'name': name,
      'company': company,
      'country': country,
      'state': state,
      'city': city,
      'zip': zip,
      'address': address,
      'address2': address2,
      'phone': phone,
    };
  }

  factory Invoice.fromMap(Map<String, dynamic> map) {
    if (map == null) return null;

    return Invoice(
      name: map['name'],
      company: map['company'],
      country: map['country'],
      state: map['state'],
      city: map['city'],
      zip: map['zip'],
      address: map['address'],
      address2: map['address2'],
      phone: map['phone'],
    );
  }

  String toJson() => json.encode(toMap());

  factory Invoice.fromJson(String source) => Invoice.fromMap(json.decode(source));

  @override
  String toString() {
    return 'Invoice(name: $name, company: $company, country: $country, state: $state, city: $city, zip: $zip, address: $address, address2: $address2, phone: $phone)';
  }
}

class CardData {
  String number;
  String expiry;
  String cvc;
  String holder;

  CardData({
    this.number,
    this.expiry,
    this.cvc,
    this.holder,
  });

  Map<String, dynamic> toMap() {
    return {
      'number': number,
      'expiry': expiry,
      'cvc': cvc,
      'holder': holder,
    };
  }

  factory CardData.fromMap(Map<String, dynamic> map) {
    if (map == null) return null;

    return CardData(
      number: map['number'],
      expiry: map['expiry'],
      cvc: map['cvc'],
      holder: map['holder'],
    );
  }

  String toJson() => json.encode(toMap());

  factory CardData.fromJson(String source) => CardData.fromMap(json.decode(source));

  @override
  String toString() {
    return 'CardData(number: $number, expiry: $expiry, cvc: $cvc, holder: $holder)';
  }
}

class Browser {
  String accept;
  String agent;
  String ip;
  bool java;
  String lang;
  int color;
  int height;
  int width;
  int tz;
  Browser({
    this.accept,
    this.agent,
    this.ip,
    this.java,
    this.lang,
    this.color,
    this.height,
    this.width,
    this.tz,
  });

  Map<String, dynamic> toMap() {
    return {
      'accept': accept,
      'agent': agent,
      'ip': ip,
      'java': java,
      'lang': lang,
      'color': color,
      'height': height,
      'width': width,
      'tz': tz,
    };
  }

  factory Browser.fromMap(Map<String, dynamic> map) {
    if (map == null) return null;

    return Browser(
      accept: map['accept'],
      agent: map['agent'],
      ip: map['ip'],
      java: map['java'],
      lang: map['lang'],
      color: map['color'],
      height: map['height'],
      width: map['width'],
      tz: map['tz'],
    );
  }

  String toJson() => json.encode(toMap());

  factory Browser.fromJson(String source) => Browser.fromMap(json.decode(source));

  @override
  String toString() {
    return 'Browser(accept: $accept, agent: $agent, ip: $ip, java: $java, lang: $lang, color: $color, height: $height, width: $width, tz: $tz)';
  }
}

class MobilApp {
  String simpleAppBackUrl;

  MobilApp({
    this.simpleAppBackUrl,
  });

  Map<String, dynamic> toMap() {
    return {
      'simpleAppBackUrl': simpleAppBackUrl,
    };
  }

  factory MobilApp.fromMap(Map<String, dynamic> map) {
    if (map == null) return null;

    return MobilApp(
      simpleAppBackUrl: map['simpleAppBackUrl'],
    );
  }

  String toJson() => json.encode(toMap());

  factory MobilApp.fromJson(String source) => MobilApp.fromMap(json.decode(source));

  @override
  String toString() => 'MobilApp(simpleAppBackUrl: $simpleAppBackUrl)';
}

class Urls {
  String success;
  String fail;
  String cancel;
  String timeout;
  Urls({
    this.success,
    this.fail,
    this.cancel,
    this.timeout,
  });

  Map<String, dynamic> toMap() {
    return {
      'success': success,
      'fail': fail,
      'cancel': cancel,
      'timeout': timeout,
    };
  }

  factory Urls.fromMap(Map<String, dynamic> map) {
    if (map == null) return null;

    return Urls(
      success: map['success'],
      fail: map['fail'],
      cancel: map['cancel'],
      timeout: map['timeout'],
    );
  }

  String toJson() => json.encode(toMap());

  factory Urls.fromJson(String source) => Urls.fromMap(json.decode(source));

  @override
  String toString() {
    return 'Urls(success: $success, fail: $fail, cancel: $cancel, timeout: $timeout)';
  }
}
 */
