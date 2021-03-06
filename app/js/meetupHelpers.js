MeetupRaffler.Helpers.getRandomMember = function(model, previousWinners) {
	var memberIsValidForPrize = function(member_id, prize) {
		console.log("checking winner " + member_id + " for eligibility to " + prize + " prize");

		var result = [];
		if (previousWinners[prize]) {
			var result = $.grep(previousWinners[prize], function(element, index) {
				return element.member.member_id === member_id;
			});
		}
		return result.length == 0;
	}

	var rsvps = model.get('rsvps');
	var min = 0;
	var max = rsvps.length - 1;
	var selectedPrize = $("#prize option:selected");
	var selectedPrizeText = selectedPrize.text().trim();
	var selectedPrizeId = selectedPrize.val();
	if (selectedPrizeText !== "") {

		var memberFound = false;
		var winningMember = {};
		var count = 0;
		while (!memberFound && count < 5) {
			var memberIndex = Math.floor(Math.random() * (max - min + 1)) + min;
			winningMember = rsvps[memberIndex].member;
			console.log("Winner " + memberIndex + " is " + winningMember.name + ' (' + winningMember.member_id + ')');
			memberFound = memberIsValidForPrize(winningMember.member_id, selectedPrizeId);
			count += 1;
		}

		if (memberFound) {
			if (!previousWinners[selectedPrizeId]) {
				previousWinners[selectedPrizeId] = [];
			}
			previousWinners[selectedPrizeId].push({'member': winningMember});
			MeetupRaffler.Helpers.displayWinner(winningMember, selectedPrizeText);
			model.set('isSelectingPrizeWinner', true);
		} else {
			MeetupRaffler.Notifier.notify('error', 'Unable to find a winner');
		}

	} else {
		MeetupRaffler.Notifier.notify('error', 'Please select a prize you silly billy!');
	}
}

MeetupRaffler.Helpers.explodeTheGuests = function(rsvps) {
	var guests = rsvps.filter(function(rsvp) {
		return rsvp.guests > 0;
	});

	guests.forEach(function(rsvp) {
		for (var guest = 0; guest < rsvp.guests; guest++) {
			rsvps.push({
				member: {
					name: rsvp.member.name + ' (Guest #' + (guest + 1) + ')',
					member_id: rsvp.member.member_id + '-1'
				},
				group: rsvp.group,
				rsvp_id: rsvp.rsvp_id
			});
		}
	});

	return rsvps;
}
