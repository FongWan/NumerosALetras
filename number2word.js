(function () {
// According to RAE, the first thirties is really special
let firstThirties = ['', 'un', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez', 'once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve', 'veinte', 'veintiún', 'veintidós', 'veintitrés', 'veinticuatro', 'veinticinco', 'veintiséis', 'veintisiete', 'veintiocho', 'veintinueve'],
    lastTens = ['', '', '', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa'],
    hundreds = ['', 'cien', 'doscientos', 'trescientos', 'cuatrocientos', 'quinientos', 'seiscientos', 'setecientos', 'ochocientos', 'novecientos'],
    millions = ['', 'millón', 'billón', 'trillón', 'cuatrillón', 'quintillón', 'sextillón', 'septillón', 'octillón', 'nonillón', 'decillón', 'undecillón', 'duodecillón', 'tredecillón', 'cuatordecillón', 'quindecillón', 'sexdecillón', 'septendecillón', 'octodecillón', 'novendecillón', 'vigintillón'],
    fractions = ['', 'décimo', 'centécimo', 'milésimo', 'diezmilésimo', 'cienmilésimo'];

let thousand2word = function (number) {
	number = number.toString();
	if (6 < number.length) return false;
	number = number.padStart(6, '0').match(/^(\d{1})(\d{2})(\d{1})(\d{2})$/).slice(1).reverse();

	let str = [];
	if (0 != number[0]) {
		if (firstThirties[Number(number[0])]) str.push(firstThirties[Number(number[0])]);
		else if (firstThirties[number[0][1]]) str.push(lastTens[number[0][0]] + ' y ' + firstThirties[number[0][1]]);
		else                                  str.push(lastTens[number[0][0]]);
	}
	if (0 != number[1]) {
		if (0 != number[0] && 1 == number[1]) str.push(hundreds[number[1]] + 'to ');
		else                                  str.push(hundreds[number[1]] + ' ');
	}
	if (0 != number[2]) {
		if (1 == Number(number[2]))                str.push('mil ');
		else if (firstThirties[Number(number[2])]) str.push(firstThirties[Number(number[2])] + ' mil ');
		else if (firstThirties[number[2][1]])      str.push(lastTens[number[2][0]] + ' y ' + firstThirties[number[2][1]] + ' mil ');
		else                                       str.push(lastTens[number[2][0]] + ' mil ');
	}
	if (0 != number[3]) {
		if (0 != number[2] && 1 == number[3]) str.push(hundreds[number[3]] + 'to ');
		else                                  str.push(hundreds[number[3]] + ' ');
	}

	return str.reverse().join('').trim();
};

let wholenumber2word = function (number) {
	// Group by 6 digits from the end
	number = number.toString();
	let groups = number.match(/(\d{1,6})(?=(\d{6})+(?!\d))/g);
	if (!groups) groups = [];
	groups.push(number.slice(-6));

	// Create words from each group and add the millions unit if needed
	let str = [];
	groups.reverse().forEach(function (item, index) {
		if (0 == Number(item)) return;
		if (1 < Number(item) && index) str.push((thousand2word(item) + ' ' + millions[index].substr(0, millions[index].length - 2) + 'ones '));
		else                           str.push((thousand2word(item) + ' ' + millions[index] + ' '));
	});
	str = str.reverse().join('').trim();
	if (0 == str.length) str = 'cero';

	return str;
};

window.number2word = function (number) {
	// Fix problem of big numbers
	number = number.toLocaleString('fullwide', {useGrouping:false});
	if (parseFloat(number) > Math.pow(10, 120)) return false;

	// Split into two parts
	number = number.split('.', 2);
	str = [wholenumber2word(number[0])];
	if (2 == number.length && Number(number[1])) {
		str.push(' con ' + wholenumber2word(number[1]) + ' ');
		let length = number[1].length;

		if (fractions[length]) str.push(fractions[length]);
		else {
			length -= 3;
			let millionsIndex = Math.floor(length / 3),
			    millionsRemain = length % 3;

			if (!millions[millionsIndex]) return false;

			switch (millionsRemain) {
				case 1:
					str.push('diez');
					break;
				case 2:
					str.push('cien');
					break;
			}

			str.push(millions[millionsIndex].substr(0, millions[millionsIndex].length - 2) + 'onésimo');
		}

		if (Number(number[1]) > 1) str.push('s');
	}
	return str.join('');
};
})();