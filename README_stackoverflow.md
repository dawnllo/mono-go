# StackOverflow study

## 搜索技巧：the search term 搜索项、搜索词

1. 设置特殊的 tags 范围, 使用 [vue] xxx
  1.1 or operator, [tag1] or [tag2], 返回这两个的。

2. 在引号中，键入简练的短语  a specific phrase（短语），使用 "flat tire"
3. 将搜索项限制在 title上，使用 title：followed by the search term
4. 只在代码块中搜索，使用 code：xxxxx
5. 仅仅搜索自己的帖子，使用 user:me  xxx
6. 在标签、术语或则短语的结果中，做排除功能，使用 [tag] "xxx" -React
7. 在标签、术语或则短语的结果中，只包含关于这对喜剧情侣前半部分的，使用 [tag] "xxx" [laurel] -[hardy]
8. 使用通配符 * 扩大搜索结果。使用 test* te*st

## 高级搜索（advance search）

1. 范围操作 Range Operators
   1. score：score:-1` or `score:-1.. 表示 返回得分大于 或则 等于 -1 的
   2. views： views:500..1000` or `views:500-1000 表示 观点 在这个范围内的帖子
   3. answers: answers:..3 表示问题有3个或则更少的回答
2. 日期 Dates
   1. created
   2. lastactive
   3. 跟随参数
      1. only year : created:2012..2013, created:2012, 年区间或单独年（1月1日，12月31日）
      2. year and month :  created:2012-04..2012-05 
      3. year and month and day : lastactive:2012-04-03
      4. `1y`, `1m`, and `1d` are shorthand for "last year", "last month", and "yesterday" , 使用 created：1m
      5. 1y.. : lastactive:3m..   如果你想看到过去三个月里所有活跃的帖子，使用lastactive:3m..在4月15日，它将显示从1月15日到最近活跃的帖子。lastactive:3m..1m可以设置范围。
3.  用户 User Operators
   1. user:mine` or `user:me，搜索的是你的帖子
   2. inbookmarks:mine（or user id），搜索的是 id 已经添加的书签的问题
   3. initags:mine（or user id），搜索标记为收藏的标签中的帖子。
4. Boolean Operator, no 代表非。
   1. isaccepted: yes/true/1, 表示返回已标记为接受的答案。
   2. hascode: yes/true/1, 表示返回只包含代码快的帖子。
   3. hasaccepted: yes/true/1, 表示返回已经接受答案的问题。
   4. isanswered: yes/true/1, 表示只返回至少有一个正面答案的问题。
   5. closed: yes/true/1, 表示只返回已经关闭的问题。
   6. duplicate: Yes/true/1, 返回被标记为重复的问题;No /false/0从搜索中排除重复的问题。
   7. migrated: yes/true/1, 返回已经被迁移到不同站点的问题。
   8. locked: yes/true/1, 只返回锁定的帖子(有编辑、投票、评论和禁用的新答案);否/false/0只返回未锁定的帖子。
   9. hasnotice: yes/trur/1, 只返回带有如下通知的帖子。
   10. wiki: yes/ture/1, 只返回社区的wiki帖子。
​		
5. miscellaneous(复杂的, 其他的)
  1. url: 'example.com', 搜索包含url的帖子
  2. is: question, 返回的仅仅是问题
  3. is: answer, 返回的仅仅是答案
  4. inquestion:50691, 将搜索限制到id 50691的问题。
  5. inquestion:this, 这将结果限制在你已经查看的帖子上。

6. Collectives(集体、集合)
  1. collective: 'Name', 在集合“名称”中搜索帖子
  2. is:article 在集合中搜索文章