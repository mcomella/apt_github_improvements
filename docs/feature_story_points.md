# Feature: GitHub Story Points

This feature helps solve the problem of, "How many days will it take to complete this milestone?"

![Example of story points](im/feature_story_points_example.png)

## Usage
To use this feature, you'll first need to estimate, in days, how long it will take your team to complete each issue. Once you have an estimate, you should apply labels to each issue based on "T-shirt sizing": `size S` is an issue that can be fixed quickly, `size M` is larger, and `size L` is the largest.

These issues should then be compiled into a milestone (we represent each sprint with a milestone). Once your issues are estimated, labeled, and added to a milestone, open it ([here's an example][example]) and the values will be calculated automatically. Note that Closed issues are not counted.

These number of days to completion that each size label represents is configurable. By default, these labels represent:
- `size S` = <= 1 day to fix
- `size M` = 2-3 days to fix
- `size L` = 4-5 days to fix

And are calculated using their maximum values.

[example]: https://github.com/mcomella/Spoon-Knife/milestone/1
