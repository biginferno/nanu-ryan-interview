Welcome to Ryan's Nanu take home interview!

I hope the project is to your liking, I had a lot of fun writing it, now onto the details.

Attached to the email I sent to rachael@nanubeauty.com is the .env file for running with supabase.

To Run in VS Code/Terminal:
npm install 
npm start

Other Notes:
I did not find any necessary complex data structures required, but I did build a decently complex tree generation algorithm. 
I approached the initial patient side first, seeing as the expert required their participation first. The logs/calendar section was isolated according to the requirements, so it was completed first.
This is the best approach in my mind, because if we had to push out updates, it's better to get problems fixed than bogging down on one task and neglecting others.

The hardest/most fun was building the settings tree. It boiled down to two simple ideas, are we a Header or Base value. Using this and mapping through the json objects data structure I converted each into its
own variation, depending on its version. I also added an adjustable value to determine if the users current role was allowed to modify the value as only Patients should be able to modify this value.

After building the tree and some painstaking styling, I setup supabase so we could retrieve the Patients settings from the Expert side. This consisted of four tables, expert, patient, logs, settings and their varied references.
I did preemptively add an expert foreign key to the logs, assuming later we would need a reference.

The expert side came smoothly just fetching, and mapping through the supabase data we retrieved. The adjustable prop came in handy to allow no modification from an Expert.

Other Other Notes:
While the challenge was relatively simple, I find I could have gone back and preemptively architected the supabase db better in the beginning.
This project was built with Typescript and Expo Router, although it wouldn't be difficult to convert to React Navigation.
I created two experts and four patients, each to show different associations. Patient 4 has a much different settings tree to showcase n-level settings, although it does look crazy in my honest opinion.

Future Modifications:
I would choose to go back and modify the login system to create an actual robust login, and user creation system. Currently it's just simple navigation and nothing simple. 
The log section would also need to be modified to sort by dates, and the calendar reflect what days have logs already.

Please follow up if there are any issues! Have a great time!
