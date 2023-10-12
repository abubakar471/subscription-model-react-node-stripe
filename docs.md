<!-- # work flow
    1, from frontend we will send our user, email address to the backend
    2. the backend will create a new checkout session of stripe and we will return that session url (that will be used for pay to us) to our frontend
    3. after getting the session url in frontend we will redirect our user to that session url to pay us using stripe's own payment page. -->

# work flow

    1. in frontend when someone goes in our protected route, first we will take his userId and email from clerk.
    2  now we will send those email and userId with a post request to our backend api's '/check-subscription' endpoint to check whether the user is subscribed or not. And if he subscribed then his subscription date valid yet.
    3. if subscription is valid then he can see the contents in protected route.
    4. if his subscription is not valid then we will redirect the user to our backend api's '/create-checkout-session' to initiate a new payment , so that he 
    can subscribe. and we will send the session url to our frontend.
    5. once he subscribes we will grab his data in our backend's webhook, and will save it in our database, so that we can check his subscription before giving
    him access to our protected route.
    6. in frontends protected route on top of navbar once we will identify that the user is subscribed , we will show a manage billings button.
    7. when subscribed user click on manage billings button in frontend, we will send a post request with our userId from clerk to our backend api's 
    '/manage-billings' endpoint, and we will create a new customer portal session , and we will send the session url to our frontend and we will redirect 
    the user to stripe's hosted billing portal page , so that he can cancel or renew his plan,