# WashEcon

*A website for aggregating and graphing Washington State economic data*

---

##Project Overview

This website is being designed for UW Economics professor Theo Eicher as a tool to be used by upper-level economics students for class assignments, projects, and individual study.

It is also being designed with a broader audience in mind. The overall goal is to produce a tool that can be used similary to the [FRED Economic Data](https://research.stlouisfed.org/fred2/) website, but with a focus on Washington state.

Main design considerations include...

* Simple and clean user experience for people from **all** economic backgrounds
* A robust feature set that allows the user a variety of ablities to mainpulate, compare, and export the datasets graphed
* The ability to display data from as wide a variety of online sources as possible

---

##Progress
*Updated as work continues ... Shooting for completion of all 'To Do' features by the start of summer (~ June 2016).*

###Completed

* Home page
* Browse function for finding data sets
* General chart display outline finished (HighChart js plugin behaving strangely)
* Hosted on AWS Elastic Beanstalk platform
* Rough idea of site's look and feel

### In Progress

* Reformulating Django models to more accurately outline the data being stored by the site
	* nearly finished, needs testing, will merge updates within the week)
* Front-end abstraction for adding/deleting/manipulating data series entries (Extension of Django's built-in admin feature)
	* Generally implemented - need to add additional features and fine-tune structure. Shooting for this being ready to use by February
* Clean up code, add comments/additional information
	* Chip away in free time, make sure new code is to standard


### To Do

* Apply styles to entire site
* Add data to AWS database service (RDS)
* Fix bugs in graphing displays
* Work with UW Economics professor Theo Eicher to add features allowing for more extensive data manipulation

---

##Tools Used

Site is being built in **Python** using the **Django** Web framework (<https://www.djangoproject.com/>)

Using **HighCharts** JavaScript plugin (<http://www.highcharts.com/>) for data visualisation, and **Requests** Python library (<http://docs.python-requests.org/en/latest/>) for HTTP requests

Making extensive use of **jQuery** for front-end development



