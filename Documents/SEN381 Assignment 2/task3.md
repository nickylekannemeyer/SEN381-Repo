# TASK 3 - APIs AND INTEGRATION DECISIONS

## 3.1 Integration Problem

Integration problem selected is the interface between the Service Request Management module and the Notification/Feedback module.

Service Request Management module will play the role of the producer or caller. On the occurrence of an event on the Service Request like transition from "In Progress" to "Resolved", information should be shared with the Notification/Feedback module.

Notification/Feedback module will play the role of the consumer or callee and will provide meaningful feedback for the requester. This helps in meeting the requirement of CivicConnect where requesters should be given meaningful feedback on request acceptance/rejection/update/completion.

The information to be exchanged could be the request ID, the requester ID, the old status, the new status, and the date and time at which the change occurred along with the corresponding notification information.

Such an interaction needs to have a concrete design decision because different modes of communication have different implications in terms of coupling, performance, error handling, testing, security, deployment, and evolution of the system. The assignment specifically mentions the possibilities of using in-process communication, HTTP/REST API, and asynchronous events/messages.

## 3.2 Approach 1 - In-Process Interface

The first option is an in-process interface.

In this approach, the Request Management component and Notification/Feedback component would remain part of the same deployed CivicConnect application. But the Request Management element would interact via an interface, rather than being dependent on the implementation of the notification element itself.

The interaction would be:

**Request Management Service → Notification Interface → Notification Service**

The main benefit is that it is simple. Communication takes place within the process, and so the operation does not involve making any network call, deploying another API and configuring another network security. Testing will also be easy since it would be possible to replace the notification interface with a mock object while performing unit testing.

The main drawback is that the components will need to be deployed together. Thus, the Notification component will not have the deployment independence that would be possible using a service.

According to (Gudelli, 2022), small applications which are monolithic are fairly simple to design, test and deploy, but when you distribute their functionality through microservices, more complexity is introduced through communication, data, security and deployment.

For the current CivicConnect project, it is therefore possible to have in-process interface for separation of responsibility without introducing the added burden of distribution.

## 3.3 Approach 2 - HTTP/REST API

The second approach is communication through an HTTP/REST API.

According to (Surwase, 2016), REST is a software architectural style where the service accesses resources and communication generally happens through HTTP protocol. REST can help create loosely coupled services in the sense that communication happens via an interface and not directly through the other component's internal workings.

For example, in the case where notification services are implemented separately, then CivicConnect would use an endpoint like:

**POST /notifications**

The Request Management module might send the request identifier, information about the requester and any changes in the request status to this resource.

Also, REST communication needs to observe proper HTTP semantics. The HTTP protocol is stateless, which means that each request will need to include all information required by the server to interpret the request without relying on previous connections' state (Fielding, Nottingham and Reschke, 2022).

HTTP methods must be used as defined by their functionality. While the GET method is mostly employed to retrieve information about resources, the POST method instructs the resource to process some information and can be used both to create new resources and submit some information for processing (Fielding, Nottingham and Reschke, 2022).

HTTP status codes must properly describe the result of the operation. Status codes in the 2xx range indicate a successful operation, codes in the 4xx range are related to clients' issues and codes in the 5xx range are related to servers' failures (Fielding, Nottingham and Reschke, 2022).

With the REST approach, there is an easy-to-describe communication contract and the ability to deploy the Notification component separately. Nevertheless, using an HTTP boundary introduces several aspects such as network latency, availability of the services, authentication, API versioning, and network failures that need to be considered.

According to (Gudelli, 2022), synchronous REST communications may be straightforward and interoperable; however, network latency and service availability may impact the process. Distributed communications imply more operational aspects in comparison with in-memory communication.

## 3.4 Approach 3 - Asynchronous Events or Messaging

The third option is asynchronous event-based communication.

Instead of the Request Management component directly asking the Notification component to perform an action, it could publish an event such as:

**RequestStatusChanged**

The Notification module could also listen to the event and handle the notification process independently.

This way of handling makes it possible to decrease the direct runtime dependency of one component from the other. The original status check does not have to depend on the outcome of notification processing, even if it is delayed by unexpected factors.

According to (Gudelli, 2022), asynchronous messaging will be helpful in decoupling services and preventing cascading failures. However, asynchronous communication poses other challenges as well – such as ensuring message consistency, duplicate handling, eventual consistency, among others.

In the case of a bigger CivicConnect application, the technique might be beneficial for cases when notifications required to be processed individually or there were many events being sent. Still, it would require additional infrastructure of a message broker or an event bus which should also be configured, secured, managed, and tested.

## 3.5 Comparison of Integration Approaches

| Comparison Factor | In-Process Interface | REST API | Asynchronous Messaging |
|---|---|---|---|
| Coupling | Low to moderate when an interface is used | Lower implementation coupling through an API contract | Low direct runtime coupling |
| Performance | High because no network communication is required | Network communication introduces overhead | Immediate caller can continue, but processing may be delayed |
| Failure behaviour | Failure occurs within the same application process | Network and remote service failures must be handled | Messages can potentially be retried, but queue and delivery failures must be managed |
| Testability | Relatively straightforward | Requires API and integration testing | Requires message/event integration testing |
| Deployment | Components are normally deployed together | Components can be independently deployed | Producer and consumer can be independently deployed |
| Security | Primarily uses the application's existing security boundary | Requires protection of the API and network communication | Requires protection of the broker, queues and message access |
| Version compatibility | Interface changes are coordinated within the application | API versions and contracts must be managed | Event schemas and compatibility must be managed |
| Operational complexity | Low | Moderate | Higher |
| Appropriate use | Modular components in one application | Separate or external services | Decoupled distributed workflows |

While REST and asynchronous messaging increase distribution and deployment independency, they come with additional costs associated with their operation. (Gudelli, 2022) outlines network latency, service availability, consistency in distribution, API compatibility, and operational complexity as the main implications of distributing microservices-based communications.

The technology and architectural choices must be based on maintainability, team skills, cost, deployment compatibility, and realistic learning needs and not only on the latest technologies.

## 3.6 Recommendation

The most optimal way to integrate the current pieces of the CivicConnect will be to establish an in-process connection between the components for Request Management and Notification/Feedback.

The two pieces should remain logically separated such that the Request Management piece doesn't depend on the implementation of the Notification piece. In contrast, the Request Management piece should communicate through a defined notification interface.

Such approach provides sufficient isolation, yet removes unnecessary coupling, while allowing deployment and testing at the same time. There is also no need to introduce a network boundary, HTTP service, and message broker due to the lack of necessity of their independent deployment and scaling.

The choice of REST API would make sense if the Notification component will be run independently or be utilized by external applications at some point in time. Async messaging might be preferable if there is the need to have its own retry policy for notification processing, higher scalability or isolation from the processing pipeline of the requests.

That is why it is not the claim that REST or async messaging are somehow bad choices, rather that the additional complexity they bring is not needed for this particular interaction with CivicConnect at this time.

The final integration decision should be documented in the Architecture Decision Record (ADR) and included in the architecture/design section of the Project Engineering Document (PED). Therefore, this calls for data/persistence design, API contracts, integration design and decisions justification to be included in the project documentation.

## References

Fielding, R., Nottingham, M. and Reschke, J. (2022) *HTTP Semantics*. RFC 9110. Internet Engineering Task Force.

Gudelli, V.R. (2022) ‘Microservice Architecture: Challenges, Solutions, and Best Practices’, *International Research Journal of Modernization in Engineering Technology and Science*, 4(9), pp. 2698–2712.

Surwase, V. (2016) ‘REST API Modeling Languages – A Developer's Perspective’, *International Journal for Science Technology & Engineering*, 2(10), pp. 634–637.