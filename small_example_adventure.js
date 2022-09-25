var small_example_adventure = toString(
{
	"pages": [{
			"short_name": "Example Room Object, does not need to be unique, just serves as a way to help keep the room human trackable",
			"ID": "-1",
			"entry_text": "The text to display as the player enters the room",
			"visited_text": "The text to display as the player enters the room after the first time",
			"exit_text": "The text to display as the player gets ready to leave the room and lists where they can go",
			"visited?": "Boolean to see if the room has already been visited, I may just keep a record in the players save file of the rooms they have visited so I dont need to clutter up the JSON file"
		},

		{
			"short_name": "",
			"ID": "",
			"entry_text": "",
			"visited_text": "",
			"exit_text": "",
			"visited?": false
		},

		{
			"short_name": "Entryway",
			"ID": "1",
			"entry_text": "This room is the first room at the player should enter ",
			"visited_text": "You should not be able to get back to this room, this is an error: Entryway",
			"exit_text": "From the entrance way you can go south to the t-junction (#2)",
			"visited?": false
		},

		{
			"short_name": "T-Junction",
			"ID": "2",
			"entry_text": "You find yourself at a T-Junction, It is made of stone and very boring",
			"visited_text": "Welcome back to the t-junction.",
			"exit_text": "You can go to the through a wooden door (#3) or further down the hall (#4)",
			"visited?": false
		},

		{
			"short_name": "Dead End",
			"ID": "3",
			"entry_text": "Uh-oh, this room is a dead end and you have to go back the way you came.",
			"visited_text": "You're very persistent, but this room is still a dead end.",
			"exit_text": "You have to go back the way you came (#2).",
			"visited?": false
		},

		{
			"short_name": "Branching Path",
			"ID": "4",
			"entry_text": "You arrived in this room after having gone further down the hall. it is a big room that is full of nothing and two doors.",
			"visited_text": "You should not be able to get back to this room, this is an error: Branching Path",
			"exit_text": "You may either go through the Red Door (#6) or the Green Door (#5).",
			"visited?": false
		},

		{
			"short_name": "Green Door Room",
			"ID": "5",
			"entry_text": "As you move through the Green Door, you hear it close and lock behind you. Standing in the middle of the room is a generic enemy NPC that will be a problem for the programmer later.",
			"visited_text": "You should not be able to get back to this room, this is an error: Green Door Room",
			"exit_text": "If you successfully beaded the enemy that may or may not have been put in this room yet, move on  through the room and go through the big golden door (#9). If you died to the enemy that may or may not exist, Your adventure is over. please go to the you beefed it room (#10)",
			"visited?": false
		},

		{
			"short_name": "Red Door Room #1",
			"ID": "6",
			"entry_text": "As you go through the red door, you hear it close and lock behind you. The only thing in this room is another red door at its far side",
			"visited_text": "You should not be able to get back to this room, this is an error: Red Door Room #1",
			"exit_text": "Only one way to go, through the second red door (#7)",
			"visited?": false
		},

		{
			"short_name": "Red Door Room #2",
			"ID": "7",
			"entry_text": "It happend agian, as you go through the red door, you hear it close and lock behind you. The only thing in this room is yet another red door at its far side",
			"visited_text": "You should not be able to get back to this room, this is an error: Red Door Room #2",
			"exit_text": "Only one way to go, through the third red door (#8)",
			"visited?": false
		},

		{
			"short_name": "Red Door Room: Fight?",
			"ID": "8",
			"entry_text": "Standing in the middle of the room you see a vicious armed Red Door. It looks like it's Out For Blood after you assaulted all of its other Red Door friends. Of course I haven't programmed a way to fight monsters yet so you're able to walk past it pretty easily. ",
			"visited_text": "You should not be able to get back to this room, this is an error: Red Door Room: Fight?",
			"exit_text": "Discounting trying to move through the red door in the middle of the room, there are two exits. The first of which is yet another red door on the right hand side of the room (#5), and the second of which is a large ostentatious gold door (#9). The choice of which door is correct is an exercise left to the reader.",
			"visited?": false
		},

		{
			"short_name": "You win!",
			"ID": "9",
			"entry_text": "Congratulations, you've made it through this exceedingly simple example of a choose-your-own-adventure that I've thrown together in about 15 minutes so that I can make the structure for the other more difficult one testable stop. Your prize is intangible and the pride in measurable.",
			"visited_text": "Welcome back to the final room, go do something else.",
			"exit_text": "This room doesn't connect anywhere else, so you can either restart (#0) or go away (Alt+f4).",
			"visited?": false
		},

		{
			"short_name": "You Beefed It",
			"ID": "10",
			"entry_text": "If you're in this room, it means you died or your debugging. I hope it meets your expectations.",
			"visited_text": "If you are back in this room, it means you died again or you're still debugging. I hope it meets your expectations again.",
			"exit_text": "The only way I expect you to be able to get out of here is to restart the game (#0), which should hopefully clear whenever variables are tracking the progress that you've made ",
			"visited?": false
		}
	]
}
);