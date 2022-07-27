import '/shared/locale.dart';
import 'package:flutter/material.dart';
import '/modules/login/login.dart';
import '/shared/nav.dart';

typedef OnCountrySelected = void Function(Country country);

class CountrySelectDialog {
  static List<Map<String, String>> filteredCountries = countries;
  // Map<String, String> _selectedCountry = countries.firstWhere((item) => item['code'] == 'HU');

  static Future<void> show(BuildContext context, OnCountrySelected onCountrySelected) async {
    await showDialog(
      context: context,
      useRootNavigator: false,
      builder: (context) {
        return StatefulBuilder(
          builder: (ctx, setState) => Dialog(
            child: Container(
              padding: EdgeInsets.all(10),
              child: Column(
                children: <Widget>[
                  TextField(
                    decoration: InputDecoration(
                      suffixIcon: Icon(Icons.search),
                      labelText: transEx(context, 'login.phone.searchByCountry'),
                    ),
                    onChanged: (value) {
                      setState(() {
                        filteredCountries = countries
                            .where((country) => country['name']!.toLowerCase().contains(value.toLowerCase()))
                            .toList();
                      });
                    },
                  ),
                  SizedBox(height: 20),
                  Expanded(
                    child: ListView.builder(
                      shrinkWrap: true,
                      itemCount: filteredCountries.length,
                      itemBuilder: (ctx, index) => Column(
                        children: <Widget>[
                          ListTile(
                            leading: Text(
                              filteredCountries[index]['flag']!,
                              style: TextStyle(fontSize: 30),
                            ),
                            title: Text(
                              filteredCountries[index]['name']!,
                              style: TextStyle(fontWeight: FontWeight.w700),
                            ),
                            trailing: Text(
                              filteredCountries[index]['dial_code']!,
                              style: TextStyle(fontWeight: FontWeight.w700),
                            ),
                            onTap: () {
                              onCountrySelected(Country.fromJson(filteredCountries[index]));
                              Nav.pop();
                            },
                          ),
                          Divider(thickness: 1),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        );
      },
    );
  }
}
