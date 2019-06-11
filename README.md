Yet another dice bot for Discord.  I created this one simply because I wanted one that 
could work with the pecularities of a variety of different systems and be inutitive for 
my own purposes.

Trello Board for Dev tracking here: https://trello.com/b/RN9kMwiS/diceless

=== Features

== Dice Rolling

Rolling is done through the /roll command.  The basic format is /roll XdY common to 
dice notation, i.e. /roll 3d6 rolls three dice and adds the total together.  There 
is no restriction on the kinds of dice rolled so you can roll non-traditional 
polyhedral shapes, i.e. /roll 7d11  

You can also pass two other parameters to /roll commands - rrX and dpl.

rrX is for rerolling any number equal to or under the value given.  For example, 
3d6 rr1 will re-roll any ones while 3d6 rr2 will re-roll any 1s or 2s.  In the list 
of resultant values the failed rolls will be displayed with a strikethrough.

dpl is a command to drop the lowest.  The lowest value dropped is shown after the 
resultant list.  So, /roll 3d6 dpl will roll three six sided dice and drop the lowest.

dph is a command to drop the highest.  

Functionally 2d20 dpl in D&D 5E is rolling with advantage and 2d20 dph is with 
disadvantage.

You can combine these to do a roll such as /roll 4d6 rr1 dpl to reroll 1s and drop the
lowest. Also, these do not requires a specific order so 

/roll 5d6 rr1 dpl
/roll dpl 5d6 rr1
/roll rr1 dpl 5d6 

are all functionaly identical.

Basic rolls will also allow you to add and subtract from the total so a command like 
/roll 3d8+7 
or 
/roll 3d8-2 

are both valid.

The XdY parameter is optional, /roll by itself will roll 1d20.  Combined with dpl or dph
it will assume it will roll 2d20 so 
/roll dpl = D&D 5E's rolling with advantage
/roll dph = rolling with disadvantage

== Insults

/insult foo will issue an insult from a stored list to a person.  These are mostly 
modified from historical insults plus a few of my own creation.  This feature has no
real function but was included while playing with early bot communication features 
and I decided to leave it in.

== Trinkets

/trinket will generate a random trinket from a stored JSON file.  I originally gathered
the list some time ago from various sources including some of my own creation.  I regret
that I didn't keep better track though I suspect many were without creditable source and
re-used from where I picked them up.  Suffice it to say I am not responsible for many of
the more interesting entries.  

== Character Stat Creation 

Right now D&D / Pathfinder stats style creation are supported via the /dndstats command. 
By default this will create six stats generated by 3d6 each.  If the dpl parameter is 
added, e.g. /dndstats dpl, then it will roll 4d6 for each and drop the lowest.  It also 
supports the rrX argument, so /dndstats dpl rr1 is a valid command.

== Comments 

All of the functions support comments now. By using a pound sign # that message will be 
appended to the results returned by the bot.  This will work on all messages unless 
explicitly stated otherwise.


