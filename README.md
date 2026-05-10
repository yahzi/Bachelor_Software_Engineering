# Coder Recruitment Platform Non-persistent Demo

This is a GitHub Pages-ready demo rebuilt from the original source code of my undergraduate graduation project, `coder_1`.

## Note for Admissions Reviewers
Please visit https://yahzi.github.io/Bachelor_Software_Engineering/ to see the demo website.
I created this static page after finding the original source code of my graduation design project. The original project was a Java SSH web application and was not convenient to run directly for a quick review because it depended on a Java web server and a database.

For easier presentation, I converted the main workflows into a non-persistent static demo. This page is intended to help reviewers understand the general topic, feature scope, and functional modules of my graduation design. It should be used as a high-level reference only, not as a fully deployed production version of the original system.

The original project used JSP, Struts2, Spring, Hibernate, and MySQL to implement an online recruitment platform. This version converts the core workflows into a pure frontend, in-memory demo that does not require Tomcat, Java, MySQL, or any build tool.

## Demo Features

- Switch between candidate and employer demo accounts
- Search jobs, filter by category, and view job details
- Edit the candidate's online resume and attachment resume field
- Apply to jobs as a candidate
- Edit employer company profile
- Post jobs and toggle jobs online or offline
- Review received applications and update application status as an employer
- View submitted applications as a candidate

All data is stored only in the current page memory. Refreshing the page restores the default demo data.

## Demo Accounts

- Candidate: `coder_demo`
- Employer: `company_demo`

You can select and log in with either account from the right side of the home page.

## File Structure

```text
github-pages/
├── index.html
├── README.md
└── styles.css
    main.js
```

## Local Preview

Open `index.html` directly in a browser.

## Deploy to GitHub Pages

1. Create a new GitHub repository.
2. Put the files from the `github-pages` directory in the repository root.
3. Commit and push the files to GitHub.
4. Open repository `Settings` -> `Pages`.
5. Set Source to `Deploy from a branch`.
6. Select the `main` branch and the `/root` directory.
7. Save and wait for GitHub Pages to generate the public URL.

## Relationship to the Original SSH Project

This version recreates the business workflows and interactive UI, but it does not recreate backend persistence.

- Original `LoginAction` / `RegisterAction`: simulated by frontend account switching.
- Original `SearchPositionAction`: simulated by an in-memory job array and keyword filtering.
- Original `ResumeServiceImpl`: simulated by editing an in-memory resume object.
- Original `CompanyServiceImpl`: simulated by editing an in-memory company object.
- Original `PositionServiceImpl`: simulated by posting jobs and toggling job status in memory.
- Original `DeliveryResumeServiceImpl`: simulated by an in-memory application array and status updates.
