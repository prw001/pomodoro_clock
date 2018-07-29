const optionButtons= document.querySelectorAll('.option_button');
optionButtons.forEach(choice => choice.addEventListener('click', chooseDigitChange));

let work_time = [2, 5, 0, 0];
let break_time = [0, 5, 0, 0];
let is_break_time = false;
let is_active = false;
let sound_active = true;

toggleDisplay();

function chooseDigitChange(e){
	let new_digit = 0
	switch(this.id){
		case "add_ten_minutes":
			new_digit = addTime(0);
			updateDisplay('#minute_tens', new_digit);
			break;
		case "add_one_minute":
			new_digit = addTime(1);
			updateDisplay('#minute_ones', new_digit);
			break;
		case "add_ten_seconds":
			new_digit = addTime(2);
			updateDisplay('#second_tens', new_digit);
			break;
		case "add_one_second":
			new_digit = addTime(3);
			updateDisplay('#second_ones', new_digit);
			break;
		case "minus_ten_minutes":
			new_digit = lessTime(0);
			break;
		case "minus_one_minute":
			new_digit = lessTime(1);
			break
		case "minus_ten_seconds":
			new_digit = lessTime(2);
			break
		case "minus_one_second":
			new_digit = lessTime(3);		
			break
		case "start_countdown":
			startOrStopClock();
			break;
		case "reset":
			resetClock();
			break;
		case "toggle_activity":
			toggleActivity();
			break;
		case "toggle_sound":
			toggleSound();
			break;
		default:
			console.log("Error");
	};
};

function addTime(index){
	//digits rollover at different integers, cap seconds-tens-place at 5
	if(is_break_time){
		if(index != 2){
			break_time[index] = (break_time[index] + 1) % 10;
		}else{
			if(break_time[index] == 5){
				break_time[index] = 0;
			}else{
				break_time[index] += 1; 
			};
		};
		return break_time[index];
	}else{
		if(index != 2){
			work_time[index] = (work_time[index] + 1) % 10;
		}else{
			if(work_time[index] == 5){
				work_time[index] = 0;
			}else{
				work_time[index] += 1; 
			};
		};
		return work_time[index];
	};

};

function lessTime(index=3){
	let digit_id = '';
	switch(index){
		case 0:
			digit_id = '#minute_tens';
			break;
		case 1:
			digit_id = '#minute_ones';
			break;
		case 2:
			digit_id = '#second_tens';
			break;
		case 3:
			digit_id = '#second_ones';
			break;
		default:
			digit_id = '';
	};
	if(!isZero()){//check before modifying numbers
		//does not allow numbers to drop below 0, restarts at 5 or 9
		if(is_break_time){
			if(index != 2){
				break_time[index] -= 1;
				if(break_time[index] == -1){
					break_time[index] = 9;
					if(is_active){//calls to rolldown the left adjacent digit
						lessTime(index - 1);
					};
				};
			}else{
				break_time[index] -= 1;
				if(break_time[index] == -1){
					break_time[index] = 5;
					if(is_active){// "..."
						lessTime(index - 1);
					};
				};
			};
			updateDisplay(digit_id, break_time[index]);
		}else{
			if(index != 2){
				work_time[index] -= 1;
				if(work_time[index] == -1){
					work_time[index] = 9;
					if(is_active){// "..."
						lessTime(index - 1);
					};
				};
			}else{
				work_time[index] -= 1;
				if(work_time[index] == -1){
					work_time[index] = 5;
					if(is_active){// "..."
						lessTime(index - 1);
					};
				};
			};
			updateDisplay(digit_id, work_time[index]);
		};
	};
	if(is_active){
		if(isZero()){
			startOrStopClock();//to automatically stop clock when at zero
			if(sound_active){
				playSound();
			};
		};
	};
};

function startOrStopClock(){
	on_off_button = document.getElementById('start_countdown');
	if(is_active){
		clearInterval(clock_run);
		is_active = false;
		buttonsToggleActive(true);
		on_off_button.classList.toggle('is_stopped');
	}else{
		clock_run = setInterval(lessTime, 1000);
		is_active = true;
		buttonsToggleActive(false);
		on_off_button.classList.toggle('is_stopped');
	};	
};

function resetClock(){
	//stop countdown, reset to default values & set to 'work'
	if(is_active){
		startOrStopClock();
	};
	work_time = [2, 5, 0, 0];
	break_time = [0, 5, 0, 0];
	is_break_time = false;
	toggleDisplay();
	is_break_time = true;
	toggleDisplay();
	toggleActivity();
};

function isZero(){
	const reducer = (accumulator, currentValue) => accumulator + currentValue;
	if(is_break_time){
		if(break_time.reduce(reducer) > 0){
			return false;
		}else{
			return true;
		};
	}else{
		if(work_time.reduce(reducer) > 0){
			return false;
		}else{
			return true;
		};
	};
};

function toggleSound(){
	display = document.getElementById('sound_indicator');
	if(sound_active){
		sound_active = false;
		display.classList.toggle('is_off');
		display.textContent = 'off';
	}else{
		sound_active = true;
		display.classList.toggle('is_off');
		display.textContent = 'on';
	};
};

function playSound(){
	const audio = document.querySelector(`audio[id="timer_chime"]`);
	audio.currentTime = 0;
	audio.play();
};

function toggleActivity(){
	if(is_active){
		startOrStopClock();//stops countdown clock is toggled
	};

	activity_button = document.getElementById('toggle_activity');
	if(is_break_time){
		is_break_time = false;
		activity_button.textContent = "work";
	}else{
		is_break_time = true;
		activity_button.textContent = "break";
	};
	toggleDisplay();
};

function updateDisplay(digit_id, new_digit){
	digit = document.querySelector(digit_id);
	digit.textContent = String(new_digit);
};

function toggleDisplay(){
	let digits = document.querySelectorAll(".digit");
	let index = 0;
	digits.forEach((digit) =>{
		if(is_break_time){
			digit.textContent = String(break_time[index]);
		}else{
			digit.textContent = String(work_time[index]);
		};
		index += 1;
	});
};

function buttonsToggleActive(enabled){
	optionButtons.forEach((button) =>{
		switch(button.id){
			case "toggle_sound":
			case "toggle_activity":
			case "start_countdown":
			case "reset":
				//let these always be enabled
				break;
			default:
				if(enabled){
					button.disabled = false;
					button.classList.toggle('disabled');
				}else{
					button.disabled = true;
					button.classList.toggle('disabled');
				};
		};
	});
};

