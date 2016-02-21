---
author: admin
comments: true
date: 2012-02-03 14:38:04+00:00
layout: post.html
slug: enable-slow-query-logging-on-amazon-rds
title: Enable slow query logging on Amazon RDS
wordpress_id: 408
categories:
- Nerd stuff
---

Because you can not access the filesystem on a RDS instance you have to configure slow query logging using the RDS command-line tools. The slow query data will be stored in the slow_query table in the mysql database. ([Amazon FAQ](http://aws.amazon.com/rds/faqs/#14))


<!-- more -->
**1. Install the RDS command-line tools**
[http://aws.amazon.com/developertools/2928](http://aws.amazon.com/developertools/2928)

**2. Create a new parameter group**
`rds-create-db-parameter-group mycustom-parameter-group -f mysql5.1 -d "This is my custom database parameter group"`

**3. Put your DB instance in that parameter group**
`rds-modify-db-instance --db-parameter-group-name mycustom-parameter-group --apply-immediately`

**4. Enable slow query loggin in your new parameter group**
`rds-modify-db-parameter-group mycustom-parameter-group --parameters "name=slow_query_log, value=ON, method=immediate" --parameters "name=long_query_time, value=5, method=immediate" --parameters "name=min_examined_row_limit, value=100, method=immediate"
`
(long_query_time is set to 5 seconds in this example)

**5. Reboot your db instance**
`rds-reboot-db-instance`



Now you wil be able to view your slow query log in the slow_log table in the mysql database





#### How do you clear the slow_log table?




You will not have enough credentials to truncate the slow_log table. When you want to empty the slow_log table use the following stored procedure:


`CALL rds_rotate_slow_log`



This stored procedure will the data to slow_log_backup and empty the slow_log table.
