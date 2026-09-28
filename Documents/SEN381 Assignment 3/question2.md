# QUESTION 2 - SECURITY ENGINEERING AND THREAT-BASED CONTROLS

## 2.1 Threat Modelling and Security Engineering

The topic of security should be considered during the development process itself and not just post development implementation. According to (Futcher and von Solms, 2008), the concept of secure software development means that security should be incorporated during the software development life cycle itself. (Borky and Bradley, 2019) also state that security controls should be considered part of the system architecture, design, and risk management process.

Threat modeling is an established process of identification of threats before deciding on the implementation of controls. One such method is the STRIDE approach. This takes into consideration six different types of threats, namely, Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, and Elevation of Privilege. (Rouland, Hamid and Jaskolka, 2021) have elaborated on the STRIDE approach and its use in identification of threats during software architecture stage.

Threat modeling can be used for CivicConnect to list threats to do with requesters, staff, management, service-request data and the functions that each has access to. Some examples of such threats are a requester accessing the request made by another, a person making unauthorized changes to a request's status, malicious data submission through forms, and sensitive data exposure.

Threat modeling cannot guarantee that CivicConnect is safe. Rather, it provides data that will be used at a later stage in Milestone 3 to choose the right security and validation processes.

## 2.2 Unauthorized Access and Access Control

An issue that might affect the security of the CivicConnect application is that of unauthorized access to service request data and functions. There are distinct user categories within the system, such as requestors, staff and management. They should not necessarily have access to the same data or functions.

In an example, one requestor might be able to access another requestor's request by altering a requestor ID or accessing a function not meant for him. Similar issues can arise if the staff member could perform functions only accessible by management members.

According to (Li, 2020), some software security flaws are broken access control and authorization errors. This indicates that the goal of security should be to ensure that the user accesses only the data and functionality that corresponds to their position.

Some of the controls that can be considered in the future include role-based access control, server-side authorization and least privilege. Least privilege indicates that the user should get access only to what is needed to carry out their legitimate duties.

Some examples of verification evidence include tests that ensure that requesters do not have access to another requester's data, staff and management permission tests, authorization negative tests and access control code review.

The remaining risk is that the model of roles is poorly constructed or an authorized account becomes hacked. Testing access control provides evidence that there might still be some authorization problems.

## 2.3 Tampering with Request Data and Status

Other security risks include unauthorized modification of request data or status of the request. Accuracy of request data, status transitions and reliable history of activities performed is essential for CivicConnect.

Tampering is one of the types of threats in the STRIDE risk assessment model as described by (Rouland, Hamid and Jaskolka, 2021). In CivicConnect, the example of a tampering threat is an unauthorized user modifying the status of the request, altering the data of the request or performing any alteration without recording it.

The security goal is to maintain the integrity of the request information and make sure that important modifications are made by authorized users.

Controls may include server-side authorization checks, status transition controls, database integrity controls, and audit logging. The audit logs can document the individual who carried out the crucial process, the alteration and the time at which it happened.

The verification evidence may include tests of updates made by authorized and unauthorized users, status transition tests, examination of audit logs, and testing of whether there is documentation of important changes made by an authenticated individual.

The residual risks will remain since the individual having the compromised privileged account will still be able to carry out undesirable activities and appear to be authorized.

## 2.4 Injection and Unsafe Input Handling

Input is received from forms, comments, search queries, among other inputs. This represents a security issue because the input is untrusted, meaning that it may not always be safe or as expected.

According to (Li, 2020), injection presents itself as one of the security weaknesses in web applications and highlights the use of Static Application Security Testing to discover such issues as SQL injection and cross-site scripting.

The security goal would be ensuring that input does not lead to any undesired application or database behavior.

Some of the controls may include server-side input validation, parameterized database operations, and proper output management. The inputs need to be validated based on the legitimate needs of CivicConnect rather than treating any data coming into the application as good.

The verification evidence can include unit tests for validation logic, integration tests with invalid or out-of-the-ordinary inputs, code reviews, and Static Application Security Testing.

One of the open issues is the fact that automated tools do not guarantee discovery of all vulnerable input channels. According to (Li, 2020), there are cases when Static Application Security Testing can generate both false positives and false negatives. A clean scan does not provide any guarantee about security of all inputs in CivicConnect.

## 2.5 Exposure of Sensitive Information

CivicConnect may have stored sensitive information which is not supposed to be seen by all users, and it may consist of sensitive personal information, comments or other request information.

According to (Li, 2020), sensitive data exposure and clear text transmission are identified as security issues within software security. (Borky and Bradley, 2019) also mentioned the importance of handling sensitive information during system and cybersecurity design.

In case of sensitive information being accessed by any unauthorized user or transmission of such information without proper encryption is an identified security threat.

The security goal for this threat would be to keep the sensitive information confidential and make it accessible only for the authorized users.

Some of the potential controls include access-control policies, protected communication, protection of sensitive data when stored, and proper management of configuration and credentials.

Evidence of verification includes access-control testing, configuration review, verification of protected communication, and verification that access roles which are not authorized cannot access any protected data.

There is always some residual risk as there will be improper classification of information, misconfiguration of systems, or improper use of information by authorized users.

## 2.6 Threat-to-Control Traceability Table

| Threat / Misuse | Security Requirement or Control Objective | Possible Engineering Control | Verification Evidence | Residual Risk / Limitation |
|---|---|---|---|---|
| A requester or lower-privileged user accesses another user's request or performs an action outside their role. | Ensure that request information and protected actions are only available to authorized users. | Role-based access control, server-side authorization and least-privilege permissions. | Role-based integration tests, negative authorization tests and code review. | Incorrect role design, missing authorization checks or compromised accounts may still result in inappropriate access. |
| Request information, status or history is modified without proper authority. | Preserve the integrity and accountability of service-request information. | Server-side authorization, controlled status transitions, integrity controls and audit logging. | Authorized and unauthorized update tests, status-transition tests and audit-log review. | A compromised privileged account may still perform harmful actions. Logging does not automatically prevent misuse. |
| Malicious or unexpected data is entered through forms, comments or other inputs. | Prevent untrusted input from causing unintended application or database behavior. | Server-side validation, parameterized database operations, output handling and secure coding. | Validation tests, integration tests, code review and SAST results. | Automated tools may produce false positives or false negatives and may not identify every vulnerable input path. |
| Sensitive request information is exposed to an unauthorized user or system component. | Maintain confidentiality and restrict sensitive information to authorized users. | Access controls, protected communication, appropriate protection of stored information and controlled configuration. | Authorization tests, configuration review and communication-security checks. | Misconfiguration, incorrect data classification or compromised authorized accounts may still expose information. |

## 2.7 Defense in Depth and Least Privilege

The security must not be based on a single control. (Futcher and von Solms, 2008) promote the inclusion of security across the entire process of software development, whereas (Borky and Bradley, 2019) state that security controls fall into the category of architecture, design and risk management.

In the case of CivicConnect, this means using a multi-layered defense approach. UI restrictions must not be substituted for server-side authorizations. Server-side authorizations must not be substituted for database integrity controls. Scanning must not be substituted for code reviews, threat modelling, or security testing.

Least privilege principle should also be considered due to the presence of different types of users in the system - requesters, staff, and management. Each type of user must get only those privileges required to accomplish their job functions. According to (Li, 2020), wrong permissions and too many privileges belong to known security weaknesses in software.

## 2.8 Secure Design, Secure Coding and Security Checking

There is secure design, secure coding, and security checking for different aspects of the security issue.

Secure design deals with threat and security requirement identification before implementation. The STRIDE approach can help with this by discovering any threats to components, users, and system interaction (Rouland, Hamid and Jaskolka, 2021).

Secure coding is concerned with the correct implementation of these requirements. (Futcher and von Solms, 2008) argue that secure development should lead developers through the entire process.

Security checking proves the presence of implementation problems. (Li, 2020) states that Static Application Security Testing can detect some known coding problems.

All these approaches should support each other. One can have a good design while having the code full of bugs. One can also have secure code but implement an incorrect access-control mechanism. The security scanner might reveal bad coding but cannot know if the business logic in the CivicConnect system allows some role to do what should be done by another role.

## 2.9 Limitations of Automated Security Tools

The value of automated security tools lies in their ability to continually scan the software for well-known vulnerabilities. However, having a clean scanner report is not an indication of a secure system.

According to (Li, 2020), Static Application Security Testing can result in false positives and negatives. Automated tools might find it difficult to address issues in authentication, access control, configuration, and business logic.

This is very pertinent to the case of CivicConnect since an automated tool will find it difficult to understand which services are supposed to be accessible to a certain user and which are supposed to be reserved for the staff and management.

Coverage is another weakness of automated tools since libraries, frameworks and configurations can have security behavior that cannot fully be captured by the application's source code.

## 2.10 Limitations of AI-Generated Security Recommendations

AI tools can be useful in assisting security research, programming, and threat analysis by the developers, however recommendations produced by the AI systems cannot be considered definitive security evidence.

(Klemmer et al., 2024) discovered that software engineers employ AI assistants in performing security-related functions like code generation, threat modeling, and vulnerability assessment. Nonetheless, security and quality concerns were raised by developers, who kept reviewing the AI output.

The first drawback of AI is that AI might give a technically sound recommendation without knowing about CivicConnect architecture, roles, data sensitivity, and project constraints.

The second potential drawback of AI is that the output produced by the AI itself might possess some security vulnerabilities.

## 2.11 Critical Question

**In case the security scanner results in no high-severity findings, what important claims about the security can still be left unverified?**

Clean results of the security scanner are valuable evidence. However, they do not guarantee the security of the CivicConnect platform.

According to (Li, 2020), automated security assessment tools might have false negative errors and difficulties to detect such aspects of the security as access control, authentication, configuration and business logic vulnerabilities.

Therefore, clean scanner result would not be able to prove that the CivicConnect application has proper permissions segmentation between requester, staff and management permissions. Neither would it prove that all the workflows prevent any unauthorized actions. It would not verify that all sensitive data is securely stored, that there are all the required audit logs available and that there are no security flaws regarding configuration and dependencies.

Therefore, the correct interpretation of the clean result would be that the scanner did not discover high-severity findings within its capacity of analysis.

Threat modeling, secure design, secure coding, code reviews, role-based testing, and integration testing are evidence that support each other. However, in Milestone 3, it will be necessary to determine the right combination of security measures and evidence for the real CivicConnect implementation.

# REFERENCES

Borky, J.M. and Bradley, T.H. (2019) 'Protecting Information with Cybersecurity', in *Effective Model-Based Systems Engineering*. Cham: Springer, pp. 345-404. doi: 10.1007/978-3-319-95669-5_10.

Futcher, L. and von Solms, R. (2008) 'Guidelines for secure software development', in *Proceedings of the 2008 Annual Research Conference of the South African Institute of Computer Scientists and Information Technologists on IT Research in Developing Countries: Riding the Wave of Technology*. New York: ACM, pp. 56-65. doi: 10.1145/1456659.1456667.

Klemmer, J.H. et al. (2024) 'Using AI Assistants in Software Development: A Qualitative Study on Security Practices and Concerns', in *Proceedings of the 2024 ACM SIGSAC Conference on Computer and Communications Security*, pp. 2726-2740. doi: 10.1145/3658644.3690283.

Li, J. (2020) 'Vulnerabilities Mapping based on OWASP-SANS: A Survey for Static Application Security Testing (SAST)', *Annals of Emerging Technologies in Computing*, 4(3), pp. 1-8. doi: 10.33166/AETiC.2020.03.001.

Rouland, Q., Hamid, B. and Jaskolka, J. (2021) 'Specification, detection, and treatment of STRIDE threats for software components: Modeling, formal methods, and tool support', *Journal of Systems Architecture*, 117, 102073. doi: 10.1016/j.sysarc.2021.102073.