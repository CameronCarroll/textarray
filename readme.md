TextArray
---------

A Node (Express) application for scheduling automated SMS messages. 

What are we storing in the database?
-------------------------------------

Well, we need to store user data (each user should be able to log in and manage their sms delivery options)
aaand we need to store job data. each job is instantiated with a message set, halt time, and delivery number.
Each job also stores state data of last sms time, sms_sent_counter

