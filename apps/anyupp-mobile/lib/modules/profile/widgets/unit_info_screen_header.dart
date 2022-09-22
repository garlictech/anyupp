import 'package:anyupp/models.dart';
import 'package:anyupp/shared/locale.dart';
import 'package:anyupp/shared/widgets.dart';
import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';

import '../utils/profile_utils.dart';
import '/core/theme/theme.dart';

class UnitInfoScreenHeader extends StatelessWidget {
  final Unit unit;

  UnitInfoScreenHeader({Key? key, required this.unit}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [

        // Google map
        SizedBox(
          width: double.infinity,
          height: 250,
          child: Stack(
            children: [
              Positioned.fill(
                child: GoogleMap(
                  compassEnabled: true,
                  myLocationButtonEnabled: false,
                  mapToolbarEnabled: false,
                  zoomControlsEnabled: false,
                  mapType: MapType.normal,
                  zoomGesturesEnabled: true,
                  initialCameraPosition: CameraPosition(
                    target: LatLng(unit.location.lat, unit.location.lng),
                    zoom: 11.0,
                  ),
                  markers: {
                    Marker(
                      markerId: MarkerId('USER'),
                      position: LatLng(unit.location.lat, unit.location.lng),
                    )
                  },
                ),
              ),
              Positioned(
                left: 16,
                top: 52,
                child: BorderedWidget(
                  width: 40,
                  height: 40,
                  onPressed: () {
                    Navigator.pop(context);
                  },
                  child: Icon(
                    Icons.close,
                    color: theme.secondary,
                  ),
                ),
              ),
            ],
          ),
        ),

        // unit name, address, button
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 24.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // name
              Text(
                unit.name,
                style: Fonts.hH2(
                    color: theme.secondary
                ),
              ),
              // address
              Padding(
                padding: const EdgeInsets.only(top: 12.0, bottom: 24.0),
                child: Text(
                  unit.address.asFormattedString(),
                  maxLines: 2,
                  style: Fonts.hH5(
                    color: theme.secondary,
                  ),
                ),
              ),
              // button
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(36.0),
                    ),
                    backgroundColor: theme.button.withOpacity(0.12),
                    elevation: 0,
                  ),
                  onPressed: () => openMapsDialog(context, unit.location),
                  child: Padding(
                    padding: const EdgeInsets.symmetric(vertical: 18.0, horizontal: 32.0),
                    child: Text(
                      trans(context, 'unitinfo.showMap').toUpperCase(),
                      style: Fonts.hH4(
                        color: theme.button,
                      ),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

}

