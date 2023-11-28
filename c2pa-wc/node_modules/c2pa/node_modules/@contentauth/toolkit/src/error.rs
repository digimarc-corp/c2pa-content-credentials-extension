// Copyright 2021 Adobe
// All Rights Reserved.
//
// NOTICE: Adobe permits you to use, modify, and distribute this file in
// accordance with the terms of the Adobe license agreement accompanying
// it.
use thiserror::Error;

#[derive(Error, Debug)]
pub enum Error {
    #[error(transparent)]
    SerdeInput(#[from] serde_wasm_bindgen::Error),

    #[error("javascript conversion error")]
    JavaScriptConversion,

    #[error(transparent)]
    C2pa(#[from] c2pa::Error),
}

pub type Result<T> = std::result::Result<T, Error>;
