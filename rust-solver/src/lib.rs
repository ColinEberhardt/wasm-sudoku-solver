mod utils;

use sudoku::Sudoku;
use wasm_bindgen::prelude::*;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
pub fn solve(sudoku_line: String) -> String {
    let sudoku = Sudoku::from_str_line(&sudoku_line).unwrap();
    if let Some(solution) = sudoku.solve_unique() {
        let line = solution.to_str_line(); 
        let line_str: &str = &line;
        return line_str.to_string();
    } else {
        return String::from("");
    }
}
