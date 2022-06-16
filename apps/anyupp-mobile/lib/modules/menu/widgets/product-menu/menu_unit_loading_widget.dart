import 'package:flutter/material.dart';
import 'package:shimmer/shimmer.dart';

class UnitMenuLoadingWidget extends StatelessWidget {
  const UnitMenuLoadingWidget({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Shimmer.fromColors(
      baseColor: Colors.grey[300]!,
      highlightColor: Colors.grey[100]!,
      enabled: true,
      child: ListView.builder(
        physics: BouncingScrollPhysics(),
        itemBuilder: (_, position) {
          if (position == 0) {
            return Container(
              decoration: BoxDecoration(
                border: Border.all(
                  width: 1.0,
                  color: Colors.white,
                ),
              ),
              margin: EdgeInsets.only(bottom: 8.0),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.start,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: <Widget>[
                  Container(
                    width: double.infinity,
                    height: 100.0,
                    color: Colors.white,
                  ),
                  SizedBox(
                    height: 8.0,
                  ),
                  Container(
                    margin: const EdgeInsets.only(left: 16.0),
                    width: MediaQuery.of(context).size.width / 2.0,
                    height: 32.0,
                    color: Colors.white,
                  ),
                  SizedBox(
                    height: 8.0,
                  ),
                  Container(
                    margin: const EdgeInsets.only(left: 16.0),
                    width: MediaQuery.of(context).size.width / 1.5,
                    height: 16.0,
                    color: Colors.white,
                  ),
                  SizedBox(
                    height: 16.0,
                  ),
                  Container(
                    margin: const EdgeInsets.only(left: 16.0, right: 16.0),
                    width: double.infinity,
                    height: 48.0,
                    color: Colors.white,
                  ),
                  SizedBox(
                    height: 16.0,
                  ),
                  Row(
                    children: List.generate(
                        3,
                        (index) => Container(
                              margin: const EdgeInsets.only(
                                left: 16.0,
                                bottom: 16.0,
                              ),
                              width: 120,
                              height: 32.0,
                              color: Colors.white,
                            )),
                  ),
                  SizedBox(
                    height: 16.0,
                  ),
                ],
              ),
            );
          }

          return Container(
            margin: const EdgeInsets.only(
              bottom: 16.0,
              left: 16.0,
              right: 16.0,
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Container(
                  margin: const EdgeInsets.only(right: 16.0),
                  width: 80.0,
                  height: 80.0,
                  color: Colors.white,
                ),
                Expanded(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.start,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: <Widget>[
                      Container(
                        width: MediaQuery.of(context).size.width / 3.0,
                        height: 22.0,
                        color: Colors.white,
                      ),
                      SizedBox(
                        height: 6.0,
                      ),
                      Container(
                        width: double.infinity,
                        height: 14.0,
                        color: Colors.white,
                      ),
                      SizedBox(
                        height: 12.0,
                      ),
                      Container(
                        width: MediaQuery.of(context).size.width / 4.0,
                        height: 18.0,
                        color: Colors.white,
                      ),
                    ],
                  ),
                ),
              ],
            ),
          );
        },
        itemCount: 5,
      ),
    );
  }
}
