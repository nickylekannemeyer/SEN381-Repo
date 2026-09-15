# TASK 2 - PERSISTENCE AND DATA-INTEGRITY DECISIONS

## 2.1 Selected Business Operation

The selected CivicConnect business process involves changing the status of the service request while at the same time logging the change into the request history or audit log.

CivicConnect allows authorized employees to change the status of the request by means of a controlled transition, as well as recording the actions that were performed, comments on the action, and its outcome. It is also essential that requestors can see the current status of their submitted request and receive adequate feedback whenever a request is changed or completed.

Such a process is vital since one of the problems associated with the CivicConnect example is the lack of accountability for changes made to the service requests. The existing process is also lacking a single controlled log of the entire request life cycle.

A data integrity problem may arise when an employee makes a transition from In Progress to Resolved and the history log fails to register this transition. The request will be seen as being resolved, but no records will be left regarding who changed it, when the change was made, and what action was performed. Oppositely, a history entry could be made without changing the status of the request.

## 2.2 Transactions and Atomicity

Transactions are vital since they help ensure that a set of related database operations can be carried out as a unit. According to (Vossen, 1995), transactions serve an essential means of providing concurrency control on database operations and ensuring reliability and correctness.

In CivicConnect, the update of the service request and addition of the corresponding history should take place within one transaction. In the transaction, first, the request status is updated, and after that, the history entry is generated. Only in the case of successful completion of both operations, the transaction should be completed. Otherwise, the transaction should be rolled back to restore the database to its original state.

For example, if the request status is updated to Resolved and a history record is successfully added, the transaction may be committed. But if the status of the request is changed and the history record cannot be added, the whole transaction should be rolled back.

(Younas, Eagelstone and Holton, 2000) describe the ACID transaction paradigm, noting that transaction correctness may become too constrained in complicated web-based multidatabase settings. They suggest more flexible methods of handling transactions across multiple databases. But the chosen CivicConnect transaction is comprised of changes that are closely tied to each other in the persistence layer of the application and does not involve complicated transactions among various independent databases.

## 2.3 Validation and Business Rules

Validation needs to take place across multiple layers within CivicConnect rather than being done using just one layer. These three key layers include the user interface/client layer, application/service layer, and database layer.

The user interface layer must ensure the prevention of any obvious input errors and help the user provide valid input data. For instance, the staff member will pick the status of the request from an acceptable list instead of entering any random input. In addition, any required input data like the resolution of the request when it is closed can be validated prior to submission.

However, the validation through client-side validation alone should not be considered adequate. According to OWASP, it is easy to bypass client-side validation, hence the recommendation for validation through server-side prior to the processing of the information in the application's functions (OWASP Foundation, n.d.).

The application or service layer is supposed to implement the principal business rules of CivicConnect. For instance, it should confirm whether the authorized employee has the right to change the request and whether the chosen transition is valid and all necessary information for this transition is provided. The request should not be able to undergo an invalid status transition simply because the user interface passed this value.

The database is supposed to give the last layer of protection of integrity. According to (Yesin et al., 2021), it is necessary to implement measures that would not allow improper changes and protect the data from distortion. It is also important to discuss how important correct transactions are for integrity of the database (Yesin et al., 2021).

This way, CivicConnect could have used constraints like the Primary key constraint to ensure the uniqueness of requests, Foreign key constraint to make sure that history items were part of legitimate requests and required fields constraints when certain data was not supposed to be missing.

Relying on the user interface would be very risky since it can be easily bypassed. Relying on the application layer would limit the security offered by the database itself. Relying solely on the database would mean that more complex workflows and business logic would be harder to manage. It is therefore more appropriate to have layers in which the specific roles are clear.

## 2.4 Consistency, Concurrency and Integrity

Concurrency plays a role when there are multiple staff members trying to modify the same request at the same time.

In this case, for instance, Staff Member A and Staff Member B could open the same request, where its status is In Progress. Staff Member B would then modify the status of the request to Resolved. At the same time, if Staff Member A is working with the older request and finally modifies its status, the latest information would be lost.

According to (Moluma and Esiefarienrhe, 2025), different concurrency control methods can be used. They mention traditional locking, multi-version, and optimistic solutions. The analysis conducted by (Moluma and Esiefarienrhe, 2025) showed that the performance of traditional solutions remains consistent but there might be some problems with concurrency, whereas multi-version and optimistic solutions might increase scalability but lead to higher numbers of transaction abortions.

Optimistic concurrency control could be used for CivicConnect as there is a lower probability of making simultaneous changes to the same request as compared to highly transactional systems. A version number or similar attribute can be used for the requests. CivicConnect needs to check whether the request has been changed since the user got it. In case some other employee has made a change to the request, then the outdated change needs to be discarded and the user should be asked to get the latest version of the request rather than overwriting the new version of the request.

There will also be protection for data integrity by means of transactions, validation, authorization and database constraints.

## 2.5 Caching Consideration

Caching is not recommended for the selected status update operation at this point in the development of the CivicConnect project. The current status of the service request is correctness-sensitive information. Caching such information may lead to the possibility of seeing outdated information about the request after its status was updated by another user.

Caching can be beneficial if CivicConnect will eventually need to process high read load in the future, but it also involves extra problems with cache invalidation and stale data. There are currently no indications that CivicConnect needs such extra complexity. Master Project Brief highlights scope discipline, saying that a smaller, more manageable solution can show better software engineering skills than a big and unfinished solution.

## 2.6 Comparison of Implementation Approaches

| Comparison Factor | Approach 1: Application/Service-Layer Rules with Database Constraints | Approach 2: Database-Centered Rules |
|---|---|---|
| Business rules | Main business rules are implemented in the application/service layer | A large amount of business logic is implemented using database procedures, triggers and constraints |
| Transactions | Application controls the transaction containing the status and history update | Database procedures can control the transaction |
| Integrity | Database constraints provide final integrity protection | Strong database-level enforcement |
| Testing | Business rules can be tested through application unit and integration tests | Greater dependence on database integration testing |
| Maintainability | Business logic remains visible within the application code | Logic can become divided between application code and database objects |
| Concurrency | Application can use optimistic concurrency checking | Database locking and other DBMS mechanisms can manage conflicts |
| Complexity | Moderate | Can become difficult to maintain if excessive logic is stored in the database |
| Database dependence | Less dependence on DBMS-specific functionality | Greater possibility of dependence on a specific DBMS |

Approach 2 provides strong database control, but placing too much business logic in the database could increase complexity and make the system more difficult for the team to modify. Approach 1 keeps workflow-specific rules in the application while still using the database as the final integrity boundary.

## 2.7 Recommendation

For CivicConnect, the most suitable validation method is the use of application/service layer validation along with database constraints, atomic transactions, and optimistic locking.

If a staff person wants to alter the status of a request, the application/service layer must check whether the staff person is allowed to make such an alteration. The validation must be done for determining the validity of the requested status change and ensuring that the data entered by the user is complete.

Then, if the validation is successful, CivicConnect should start the transaction in the database. The status of the request should be changed along with creation of the request-history record in one transaction; if one of them fails, both operations will fail.

The database itself should be able to provide final structural integrity using the proper constraints, while the optimistic concurrency control should be able to avoid an old request to overwrite a more recent one.

The above recommendation not only gives good data correctness but is also very simple without any unnecessary complication. This must be included in the Milestone 2 data/persistence design. The above must also be documented in an architecture decision record since the CivicConnect Master Project Brief demands formal documentation of such decisions and its alternative approaches along with trade-offs.

## References

Moluma, T.L. and Esiefarienrhe, B.M. (2025) ‘Concurrency Control in Distributed Databases: A Systematic Review’, *The Indonesian Journal of Computer Science*, 14(6). doi: 10.33022/ijcs.v14i6.5045.

OWASP Foundation (n.d.) *Input Validation Cheat Sheet*. OWASP Cheat Sheet Series.

Vossen, G. (1995) ‘Database Transaction Models’, in van Leeuwen, J. (ed.) *Computer Science Today: Recent Trends and Developments*. Lecture Notes in Computer Science, Vol. 1000. Berlin: Springer-Verlag, pp. 560–574.

Yesin, V., Karpinski, M., Yesina, M., Vilihura, V. and Warwas, K. (2021) ‘Ensuring Data Integrity in Databases with the Universal Basis of Relations’, *Applied Sciences*, 11(18), 8781. doi: 10.3390/app11188781.

Younas, M., Eagelstone, B. and Holton, R. (2000) ‘A Review of Multidatabase Transactions on the Web: From the ACID to the SACReD’, in Lings, B. and Jeffery, K. (eds.) *Advances in Databases*. Lecture Notes in Computer Science, Vol. 1832. Berlin: Springer, pp. 140–152. doi: 10.1007/3-540-45033-5_10.