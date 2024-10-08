let population_raw =
[
    624895,
    611926,
    621744,
    609622,
    616662,
    635768,
    629171,
    610827,
    600367,
    634394,
    612426,
    682247,
    632159,
    613783,
    586079,
    603754,
    585295,
    605187,
    635246,
    624229,
    621708,
    615360,
    617991,
    618176,
    619082,
    620037
];

let obj_arr = [];

for(let i = 0; i < population_raw.length; i++){
    let temp_turnout = Math.floor(population_raw[i] * 0.697);
    obj_arr.push(
        {
            id: i + 1,
            populationOver18: population_raw[i],
            voterTurnout: temp_turnout,
        }
    )
}

for(let i = 0; i < obj_arr.length; i++){
    console.log(", \"populationOver18\":", obj_arr[i].populationOver18, ", \"voterTurnout\":", obj_arr[i].voterTurnout)
}