import '/core/core.dart';
import '/models.dart';
import '/shared/locale.dart';
import 'package:flutter/material.dart';

import 'rating_icon_widget.dart';

typedef OnRatingSelected = void Function(int? rating);

class RatingWidget extends StatefulWidget {
  final RatingPolicy ratingPolicy;
  final OnRatingSelected onSelected;
  const RatingWidget({
    Key? key,
    required this.ratingPolicy,
    required this.onSelected,
  }) : super(key: key);

  @override
  _RatingWidgetState createState() => _RatingWidgetState();
}

class _RatingWidgetState extends State<RatingWidget> {
  int? _selectedPosition;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        if (widget.ratingPolicy.title != null)
          Text(
            getLocalizedText(context, widget.ratingPolicy.title!),
            style: Fonts.satoshi(
              fontSize: 18.0,
              fontWeight: FontWeight.w700,
              color: theme.secondary,
            ),
          ),
        SizedBox(
          height: 32.0,
        ),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            ...(widget.ratingPolicy.ratings ?? [])
                .map((rating) => RatingIconWidget(
                      icon: rating.icon ?? 'rating-1.svg',
                      titleKey: rating.text != null
                          ? getLocalizedText(context, rating.text!)
                          : '',
                      selected: _selectedPosition == rating.value,
                      onTap: () => setState(() {
                        _selectedPosition = rating.value;
                        widget.onSelected(_selectedPosition);
                      }),
                    ))
                .toList(),
          ],
        )
      ],
    );
  }
}
