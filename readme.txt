This will be a simple ticketing system written in node .js and c.
The c part should include all the core functionality for creating, modifying, and
deleting tickets as well as search features, authentication, and
encryption/decryption of data files. The node .js will probably be a very thin
wrapper around the c code by default. It is included mainly to allow easy
customization. For example, it might be desirable to generate time-to-close
statistics. With node .js a function could easily be added to calculate time-to-close
the resulting value could be passed on the the "create_ticket" c function.

c:
retrieve_tickets()
save_tickets()
create_user()
edit_user()
authenticate_user()
delete_user()
create ticket()
edit ticket()
delete ticket()
