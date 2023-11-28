; ModuleID = 'probe1.1d2d7b3a-cgu.0'
source_filename = "probe1.1d2d7b3a-cgu.0"
target datalayout = "e-m:e-p:32:32-p10:8:8-p20:8:8-i64:64-n32:64-S128-ni:1:10:20"
target triple = "wasm32-unknown-unknown"

%"core::fmt::Arguments<'_>" = type { { ptr, i32 }, { ptr, i32 }, { ptr, i32 } }
%"alloc::string::String" = type { %"alloc::vec::Vec<u8>" }
%"alloc::vec::Vec<u8>" = type { { i32, ptr }, i32 }
%"core::ptr::metadata::PtrRepr<[u8]>" = type { [2 x i32] }
%"alloc::alloc::Global" = type {}
%"core::option::Option<(core::ptr::non_null::NonNull<u8>, core::alloc::layout::Layout)>" = type { [2 x i32], i32 }

@alloc_2a62ba4d4fa46537b277796d74f8c568 = private unnamed_addr constant <{}> zeroinitializer, align 4
@alloc_91c7fa63c3cfeaa3c795652d5cf060e4 = private unnamed_addr constant <{ [12 x i8] }> <{ [12 x i8] c"invalid args" }>, align 1
@alloc_e90401c92a6af8b32765b1534130c461 = private unnamed_addr constant <{ ptr, [4 x i8] }> <{ ptr @alloc_91c7fa63c3cfeaa3c795652d5cf060e4, [4 x i8] c"\0C\00\00\00" }>, align 4
@alloc_0f3d7beb2672f296d76a42c95890bef9 = private unnamed_addr constant <{ [75 x i8] }> <{ [75 x i8] c"/rustc/90c541806f23a127002de5b4038be731ba1458ca/library/core/src/fmt/mod.rs" }>, align 1
@alloc_1e762753cc178f3c3ea16e2257ad267d = private unnamed_addr constant <{ ptr, [12 x i8] }> <{ ptr @alloc_0f3d7beb2672f296d76a42c95890bef9, [12 x i8] c"K\00\00\00\9E\01\00\00\0D\00\00\00" }>, align 4
@alloc_420e60d8f1482c4677ae346bc94bf700 = private unnamed_addr constant <{ ptr, [12 x i8] }> <{ ptr @alloc_0f3d7beb2672f296d76a42c95890bef9, [12 x i8] c"K\00\00\00\91\01\00\00\0D\00\00\00" }>, align 4
@alloc_7899658904a09f898bd7a0ccdbda22e9 = private unnamed_addr constant <{ [80 x i8] }> <{ [80 x i8] c"/rustc/90c541806f23a127002de5b4038be731ba1458ca/library/core/src/alloc/layout.rs" }>, align 1
@alloc_7165451e6e7648131f4cd813ec677900 = private unnamed_addr constant <{ ptr, [12 x i8] }> <{ ptr @alloc_7899658904a09f898bd7a0ccdbda22e9, [12 x i8] c"P\00\00\00\C4\01\00\00)\00\00\00" }>, align 4
@str.0 = internal constant [25 x i8] c"attempt to divide by zero"
@alloc_97350e8bf483c1fe1c3a218b02d80fb1 = private unnamed_addr constant <{ ptr, [4 x i8] }> <{ ptr @alloc_2a62ba4d4fa46537b277796d74f8c568, [4 x i8] zeroinitializer }>, align 4
@alloc_83ea17bf0c4f4a5a5a13d3ae7955acd0 = private unnamed_addr constant <{ [4 x i8] }> zeroinitializer, align 4

; core::fmt::ArgumentV1::new_lower_exp
; Function Attrs: inlinehint nounwind
define hidden { ptr, ptr } @_ZN4core3fmt10ArgumentV113new_lower_exp17h0507bf28dbe4a85bE(ptr align 4 %x) unnamed_addr #0 {
start:
  %0 = alloca { ptr, ptr }, align 4
  store ptr %x, ptr %0, align 4
  %1 = getelementptr inbounds { ptr, ptr }, ptr %0, i32 0, i32 1
  store ptr @"_ZN4core3fmt3num3imp55_$LT$impl$u20$core..fmt..LowerExp$u20$for$u20$isize$GT$3fmt17hbc085530dd3b9514E", ptr %1, align 4
  %2 = getelementptr inbounds { ptr, ptr }, ptr %0, i32 0, i32 0
  %3 = load ptr, ptr %2, align 4, !nonnull !0, !align !1, !noundef !0
  %4 = getelementptr inbounds { ptr, ptr }, ptr %0, i32 0, i32 1
  %5 = load ptr, ptr %4, align 4, !nonnull !0, !noundef !0
  %6 = insertvalue { ptr, ptr } poison, ptr %3, 0
  %7 = insertvalue { ptr, ptr } %6, ptr %5, 1
  ret { ptr, ptr } %7
}

; core::fmt::Arguments::as_str
; Function Attrs: inlinehint nounwind
define internal { ptr, i32 } @_ZN4core3fmt9Arguments6as_str17hcba7911a2c3de106E(ptr align 4 %self) unnamed_addr #0 {
start:
  %_2 = alloca { { ptr, i32 }, { ptr, i32 } }, align 4
  %0 = alloca { ptr, i32 }, align 4
  %1 = getelementptr inbounds %"core::fmt::Arguments<'_>", ptr %self, i32 0, i32 1
  %2 = getelementptr inbounds { ptr, i32 }, ptr %1, i32 0, i32 0
  %_3.0 = load ptr, ptr %2, align 4, !nonnull !0, !align !2, !noundef !0
  %3 = getelementptr inbounds { ptr, i32 }, ptr %1, i32 0, i32 1
  %_3.1 = load i32, ptr %3, align 4, !noundef !0
  %4 = getelementptr inbounds %"core::fmt::Arguments<'_>", ptr %self, i32 0, i32 2
  %5 = getelementptr inbounds { ptr, i32 }, ptr %4, i32 0, i32 0
  %_4.0 = load ptr, ptr %5, align 4, !nonnull !0, !align !2, !noundef !0
  %6 = getelementptr inbounds { ptr, i32 }, ptr %4, i32 0, i32 1
  %_4.1 = load i32, ptr %6, align 4, !noundef !0
  %7 = getelementptr inbounds { ptr, i32 }, ptr %_2, i32 0, i32 0
  store ptr %_3.0, ptr %7, align 4
  %8 = getelementptr inbounds { ptr, i32 }, ptr %_2, i32 0, i32 1
  store i32 %_3.1, ptr %8, align 4
  %9 = getelementptr inbounds { { ptr, i32 }, { ptr, i32 } }, ptr %_2, i32 0, i32 1
  %10 = getelementptr inbounds { ptr, i32 }, ptr %9, i32 0, i32 0
  store ptr %_4.0, ptr %10, align 4
  %11 = getelementptr inbounds { ptr, i32 }, ptr %9, i32 0, i32 1
  store i32 %_4.1, ptr %11, align 4
  %12 = getelementptr inbounds { ptr, i32 }, ptr %_2, i32 0, i32 0
  %_19.0 = load ptr, ptr %12, align 4, !nonnull !0, !align !2, !noundef !0
  %13 = getelementptr inbounds { ptr, i32 }, ptr %_2, i32 0, i32 1
  %_19.1 = load i32, ptr %13, align 4, !noundef !0
  %_16 = icmp eq i32 %_19.1, 0
  br i1 %_16, label %bb1, label %bb3

bb3:                                              ; preds = %start
  %14 = getelementptr inbounds { ptr, i32 }, ptr %_2, i32 0, i32 0
  %_21.0 = load ptr, ptr %14, align 4, !nonnull !0, !align !2, !noundef !0
  %15 = getelementptr inbounds { ptr, i32 }, ptr %_2, i32 0, i32 1
  %_21.1 = load i32, ptr %15, align 4, !noundef !0
  %_13 = icmp eq i32 %_21.1, 1
  br i1 %_13, label %bb4, label %bb2

bb1:                                              ; preds = %start
  %16 = getelementptr inbounds { { ptr, i32 }, { ptr, i32 } }, ptr %_2, i32 0, i32 1
  %17 = getelementptr inbounds { ptr, i32 }, ptr %16, i32 0, i32 0
  %_20.0 = load ptr, ptr %17, align 4, !nonnull !0, !align !2, !noundef !0
  %18 = getelementptr inbounds { ptr, i32 }, ptr %16, i32 0, i32 1
  %_20.1 = load i32, ptr %18, align 4, !noundef !0
  %_7 = icmp eq i32 %_20.1, 0
  br i1 %_7, label %bb5, label %bb2

bb2:                                              ; preds = %bb4, %bb3, %bb1
  store ptr null, ptr %0, align 4
  br label %bb7

bb5:                                              ; preds = %bb1
  %19 = getelementptr inbounds { ptr, i32 }, ptr %0, i32 0, i32 0
  store ptr @alloc_2a62ba4d4fa46537b277796d74f8c568, ptr %19, align 4
  %20 = getelementptr inbounds { ptr, i32 }, ptr %0, i32 0, i32 1
  store i32 0, ptr %20, align 4
  br label %bb7

bb7:                                              ; preds = %bb2, %bb6, %bb5
  %21 = getelementptr inbounds { ptr, i32 }, ptr %0, i32 0, i32 0
  %22 = load ptr, ptr %21, align 4, !align !1, !noundef !0
  %23 = getelementptr inbounds { ptr, i32 }, ptr %0, i32 0, i32 1
  %24 = load i32, ptr %23, align 4
  %25 = insertvalue { ptr, i32 } poison, ptr %22, 0
  %26 = insertvalue { ptr, i32 } %25, i32 %24, 1
  ret { ptr, i32 } %26

bb4:                                              ; preds = %bb3
  %27 = getelementptr inbounds { { ptr, i32 }, { ptr, i32 } }, ptr %_2, i32 0, i32 1
  %28 = getelementptr inbounds { ptr, i32 }, ptr %27, i32 0, i32 0
  %_22.0 = load ptr, ptr %28, align 4, !nonnull !0, !align !2, !noundef !0
  %29 = getelementptr inbounds { ptr, i32 }, ptr %27, i32 0, i32 1
  %_22.1 = load i32, ptr %29, align 4, !noundef !0
  %_10 = icmp eq i32 %_22.1, 0
  br i1 %_10, label %bb6, label %bb2

bb6:                                              ; preds = %bb4
  %30 = getelementptr inbounds { ptr, i32 }, ptr %_2, i32 0, i32 0
  %_23.0 = load ptr, ptr %30, align 4, !nonnull !0, !align !2, !noundef !0
  %31 = getelementptr inbounds { ptr, i32 }, ptr %_2, i32 0, i32 1
  %_23.1 = load i32, ptr %31, align 4, !noundef !0
  %s = getelementptr inbounds [0 x { ptr, i32 }], ptr %_23.0, i32 0, i32 0
  %32 = getelementptr inbounds { ptr, i32 }, ptr %s, i32 0, i32 0
  %_24.0 = load ptr, ptr %32, align 4, !nonnull !0, !align !1, !noundef !0
  %33 = getelementptr inbounds { ptr, i32 }, ptr %s, i32 0, i32 1
  %_24.1 = load i32, ptr %33, align 4, !noundef !0
  %34 = getelementptr inbounds { ptr, i32 }, ptr %0, i32 0, i32 0
  store ptr %_24.0, ptr %34, align 4
  %35 = getelementptr inbounds { ptr, i32 }, ptr %0, i32 0, i32 1
  store i32 %_24.1, ptr %35, align 4
  br label %bb7
}

; core::fmt::Arguments::new_v1
; Function Attrs: inlinehint nounwind
define internal void @_ZN4core3fmt9Arguments6new_v117hc1e0edc46c3eebf5E(ptr sret(%"core::fmt::Arguments<'_>") %0, ptr align 4 %pieces.0, i32 %pieces.1, ptr align 4 %args.0, i32 %args.1) unnamed_addr #0 {
start:
  %_14 = alloca { ptr, i32 }, align 4
  %_12 = alloca %"core::fmt::Arguments<'_>", align 4
  %_3 = alloca i8, align 1
  %_4 = icmp ult i32 %pieces.1, %args.1
  br i1 %_4, label %bb1, label %bb2

bb2:                                              ; preds = %start
  %_9 = add i32 %args.1, 1
  %_7 = icmp ugt i32 %pieces.1, %_9
  %1 = zext i1 %_7 to i8
  store i8 %1, ptr %_3, align 1
  br label %bb3

bb1:                                              ; preds = %start
  store i8 1, ptr %_3, align 1
  br label %bb3

bb3:                                              ; preds = %bb2, %bb1
  %2 = load i8, ptr %_3, align 1, !range !3, !noundef !0
  %3 = trunc i8 %2 to i1
  br i1 %3, label %bb4, label %bb6

bb6:                                              ; preds = %bb3
  store ptr null, ptr %_14, align 4
  %4 = getelementptr inbounds %"core::fmt::Arguments<'_>", ptr %0, i32 0, i32 1
  %5 = getelementptr inbounds { ptr, i32 }, ptr %4, i32 0, i32 0
  store ptr %pieces.0, ptr %5, align 4
  %6 = getelementptr inbounds { ptr, i32 }, ptr %4, i32 0, i32 1
  store i32 %pieces.1, ptr %6, align 4
  %7 = getelementptr inbounds { ptr, i32 }, ptr %_14, i32 0, i32 0
  %8 = load ptr, ptr %7, align 4, !align !2, !noundef !0
  %9 = getelementptr inbounds { ptr, i32 }, ptr %_14, i32 0, i32 1
  %10 = load i32, ptr %9, align 4
  %11 = getelementptr inbounds { ptr, i32 }, ptr %0, i32 0, i32 0
  store ptr %8, ptr %11, align 4
  %12 = getelementptr inbounds { ptr, i32 }, ptr %0, i32 0, i32 1
  store i32 %10, ptr %12, align 4
  %13 = getelementptr inbounds %"core::fmt::Arguments<'_>", ptr %0, i32 0, i32 2
  %14 = getelementptr inbounds { ptr, i32 }, ptr %13, i32 0, i32 0
  store ptr %args.0, ptr %14, align 4
  %15 = getelementptr inbounds { ptr, i32 }, ptr %13, i32 0, i32 1
  store i32 %args.1, ptr %15, align 4
  ret void

bb4:                                              ; preds = %bb3
; call core::fmt::Arguments::new_const
  call void @_ZN4core3fmt9Arguments9new_const17h0aabe2f80c61bd34E(ptr sret(%"core::fmt::Arguments<'_>") %_12, ptr align 4 @alloc_e90401c92a6af8b32765b1534130c461, i32 1) #11
; call core::panicking::panic_fmt
  call void @_ZN4core9panicking9panic_fmt17hf5c4cd929d4aaa9eE(ptr %_12, ptr align 4 @alloc_1e762753cc178f3c3ea16e2257ad267d) #12
  unreachable
}

; core::fmt::Arguments::new_const
; Function Attrs: inlinehint nounwind
define internal void @_ZN4core3fmt9Arguments9new_const17h0aabe2f80c61bd34E(ptr sret(%"core::fmt::Arguments<'_>") %0, ptr align 4 %pieces.0, i32 %pieces.1) unnamed_addr #0 {
start:
  %_7 = alloca { ptr, i32 }, align 4
  %_5 = alloca %"core::fmt::Arguments<'_>", align 4
  %_2 = icmp ugt i32 %pieces.1, 1
  br i1 %_2, label %bb1, label %bb3

bb3:                                              ; preds = %start
  store ptr null, ptr %_7, align 4
  %1 = getelementptr inbounds %"core::fmt::Arguments<'_>", ptr %0, i32 0, i32 1
  %2 = getelementptr inbounds { ptr, i32 }, ptr %1, i32 0, i32 0
  store ptr %pieces.0, ptr %2, align 4
  %3 = getelementptr inbounds { ptr, i32 }, ptr %1, i32 0, i32 1
  store i32 %pieces.1, ptr %3, align 4
  %4 = getelementptr inbounds { ptr, i32 }, ptr %_7, i32 0, i32 0
  %5 = load ptr, ptr %4, align 4, !align !2, !noundef !0
  %6 = getelementptr inbounds { ptr, i32 }, ptr %_7, i32 0, i32 1
  %7 = load i32, ptr %6, align 4
  %8 = getelementptr inbounds { ptr, i32 }, ptr %0, i32 0, i32 0
  store ptr %5, ptr %8, align 4
  %9 = getelementptr inbounds { ptr, i32 }, ptr %0, i32 0, i32 1
  store i32 %7, ptr %9, align 4
  %10 = getelementptr inbounds %"core::fmt::Arguments<'_>", ptr %0, i32 0, i32 2
  %11 = getelementptr inbounds { ptr, i32 }, ptr %10, i32 0, i32 0
  store ptr @alloc_2a62ba4d4fa46537b277796d74f8c568, ptr %11, align 4
  %12 = getelementptr inbounds { ptr, i32 }, ptr %10, i32 0, i32 1
  store i32 0, ptr %12, align 4
  ret void

bb1:                                              ; preds = %start
; call core::fmt::Arguments::new_const
  call void @_ZN4core3fmt9Arguments9new_const17h0aabe2f80c61bd34E(ptr sret(%"core::fmt::Arguments<'_>") %_5, ptr align 4 @alloc_e90401c92a6af8b32765b1534130c461, i32 1) #11
; call core::panicking::panic_fmt
  call void @_ZN4core9panicking9panic_fmt17hf5c4cd929d4aaa9eE(ptr %_5, ptr align 4 @alloc_420e60d8f1482c4677ae346bc94bf700) #12
  unreachable
}

; core::ops::function::FnOnce::call_once
; Function Attrs: inlinehint nounwind
define internal void @_ZN4core3ops8function6FnOnce9call_once17h76175315b1a4a029E(ptr sret(%"alloc::string::String") %0, ptr align 1 %1, i32 %2) unnamed_addr #0 {
start:
  %_2 = alloca { ptr, i32 }, align 4
  %3 = getelementptr inbounds { ptr, i32 }, ptr %_2, i32 0, i32 0
  store ptr %1, ptr %3, align 4
  %4 = getelementptr inbounds { ptr, i32 }, ptr %_2, i32 0, i32 1
  store i32 %2, ptr %4, align 4
  %5 = getelementptr inbounds { ptr, i32 }, ptr %_2, i32 0, i32 0
  %6 = load ptr, ptr %5, align 4, !nonnull !0, !align !1, !noundef !0
  %7 = getelementptr inbounds { ptr, i32 }, ptr %_2, i32 0, i32 1
  %8 = load i32, ptr %7, align 4, !noundef !0
; call alloc::str::<impl alloc::borrow::ToOwned for str>::to_owned
  call void @"_ZN5alloc3str56_$LT$impl$u20$alloc..borrow..ToOwned$u20$for$u20$str$GT$8to_owned17hffcb4f6d4760ddccE"(ptr sret(%"alloc::string::String") %0, ptr align 1 %6, i32 %8) #11
  ret void
}

; core::ptr::drop_in_place<alloc::string::String>
; Function Attrs: nounwind
define hidden void @"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h7d15a4fe99eb480cE"(ptr %_1) unnamed_addr #1 {
start:
; call core::ptr::drop_in_place<alloc::vec::Vec<u8>>
  call void @"_ZN4core3ptr46drop_in_place$LT$alloc..vec..Vec$LT$u8$GT$$GT$17h05e4a1ab17f8d510E"(ptr %_1) #11
  ret void
}

; core::ptr::drop_in_place<alloc::vec::Vec<u8>>
; Function Attrs: nounwind
define hidden void @"_ZN4core3ptr46drop_in_place$LT$alloc..vec..Vec$LT$u8$GT$$GT$17h05e4a1ab17f8d510E"(ptr %_1) unnamed_addr #1 {
start:
; call <alloc::vec::Vec<T,A> as core::ops::drop::Drop>::drop
  call void @"_ZN70_$LT$alloc..vec..Vec$LT$T$C$A$GT$$u20$as$u20$core..ops..drop..Drop$GT$4drop17h6c3d8b8884340d4bE"(ptr align 4 %_1) #11
; call core::ptr::drop_in_place<alloc::raw_vec::RawVec<u8>>
  call void @"_ZN4core3ptr53drop_in_place$LT$alloc..raw_vec..RawVec$LT$u8$GT$$GT$17hc332ab6cce4405a6E"(ptr %_1) #11
  ret void
}

; core::ptr::drop_in_place<alloc::raw_vec::RawVec<u8>>
; Function Attrs: nounwind
define hidden void @"_ZN4core3ptr53drop_in_place$LT$alloc..raw_vec..RawVec$LT$u8$GT$$GT$17hc332ab6cce4405a6E"(ptr %_1) unnamed_addr #1 {
start:
; call <alloc::raw_vec::RawVec<T,A> as core::ops::drop::Drop>::drop
  call void @"_ZN77_$LT$alloc..raw_vec..RawVec$LT$T$C$A$GT$$u20$as$u20$core..ops..drop..Drop$GT$4drop17h8cd1f70b86eae699E"(ptr align 4 %_1) #11
  ret void
}

; core::alloc::layout::Layout::array::inner
; Function Attrs: inlinehint nounwind
define internal { i32, i32 } @_ZN4core5alloc6layout6Layout5array5inner17he866cbf4c6480e44E(i32 %element_size, i32 %align, i32 %n) unnamed_addr #0 {
start:
  %_19 = alloca i32, align 4
  %_15 = alloca i32, align 4
  %_10 = alloca { i32, i32 }, align 4
  %_4 = alloca i8, align 1
  %0 = alloca { i32, i32 }, align 4
  %1 = icmp eq i32 %element_size, 0
  br i1 %1, label %bb1, label %bb2

bb1:                                              ; preds = %start
  store i8 0, ptr %_4, align 1
  br label %bb3

bb2:                                              ; preds = %start
  store i32 %align, ptr %_15, align 4
  %_16 = load i32, ptr %_15, align 4, !range !4, !noundef !0
  %_17 = icmp uge i32 -2147483648, %_16
  call void @llvm.assume(i1 %_17)
  %_18 = icmp ule i32 1, %_16
  call void @llvm.assume(i1 %_18)
  %_13 = sub i32 %_16, 1
  %_7 = sub i32 2147483647, %_13
  %_8 = icmp eq i32 %element_size, 0
  %2 = call i1 @llvm.expect.i1(i1 %_8, i1 false)
  br i1 %2, label %panic, label %bb4

bb4:                                              ; preds = %bb2
  %_6 = udiv i32 %_7, %element_size
  %_5 = icmp ugt i32 %n, %_6
  %3 = zext i1 %_5 to i8
  store i8 %3, ptr %_4, align 1
  br label %bb3

panic:                                            ; preds = %bb2
; call core::panicking::panic
  call void @_ZN4core9panicking5panic17h2f041bf6aa990dfdE(ptr align 1 @str.0, i32 25, ptr align 4 @alloc_7165451e6e7648131f4cd813ec677900) #12
  unreachable

bb3:                                              ; preds = %bb1, %bb4
  %4 = load i8, ptr %_4, align 1, !range !3, !noundef !0
  %5 = trunc i8 %4 to i1
  br i1 %5, label %bb5, label %bb6

bb6:                                              ; preds = %bb3
  %array_size = mul i32 %element_size, %n
  store i32 %align, ptr %_19, align 4
  %_20 = load i32, ptr %_19, align 4, !range !4, !noundef !0
  %_21 = icmp uge i32 -2147483648, %_20
  call void @llvm.assume(i1 %_21)
  %_22 = icmp ule i32 1, %_20
  call void @llvm.assume(i1 %_22)
  store i32 %array_size, ptr %_10, align 4
  %6 = getelementptr inbounds { i32, i32 }, ptr %_10, i32 0, i32 1
  store i32 %_20, ptr %6, align 4
  %7 = getelementptr inbounds { i32, i32 }, ptr %_10, i32 0, i32 0
  %8 = load i32, ptr %7, align 4, !noundef !0
  %9 = getelementptr inbounds { i32, i32 }, ptr %_10, i32 0, i32 1
  %10 = load i32, ptr %9, align 4, !range !4, !noundef !0
  %11 = getelementptr inbounds { i32, i32 }, ptr %0, i32 0, i32 0
  store i32 %8, ptr %11, align 4
  %12 = getelementptr inbounds { i32, i32 }, ptr %0, i32 0, i32 1
  store i32 %10, ptr %12, align 4
  br label %bb7

bb5:                                              ; preds = %bb3
  %13 = getelementptr inbounds { i32, i32 }, ptr %0, i32 0, i32 1
  store i32 0, ptr %13, align 4
  br label %bb7

bb7:                                              ; preds = %bb6, %bb5
  %14 = getelementptr inbounds { i32, i32 }, ptr %0, i32 0, i32 0
  %15 = load i32, ptr %14, align 4
  %16 = getelementptr inbounds { i32, i32 }, ptr %0, i32 0, i32 1
  %17 = load i32, ptr %16, align 4, !range !5, !noundef !0
  %18 = insertvalue { i32, i32 } poison, i32 %15, 0
  %19 = insertvalue { i32, i32 } %18, i32 %17, 1
  ret { i32, i32 } %19
}

; core::option::Option<T>::map_or_else
; Function Attrs: inlinehint nounwind
define hidden void @"_ZN4core6option15Option$LT$T$GT$11map_or_else17h8ff28ae11dd34f42E"(ptr sret(%"alloc::string::String") %0, ptr align 1 %1, i32 %2, ptr align 4 %default) unnamed_addr #0 {
start:
  %_10 = alloca i8, align 1
  %_9 = alloca i8, align 1
  %_7 = alloca { ptr, i32 }, align 4
  %self = alloca { ptr, i32 }, align 4
  %3 = getelementptr inbounds { ptr, i32 }, ptr %self, i32 0, i32 0
  store ptr %1, ptr %3, align 4
  %4 = getelementptr inbounds { ptr, i32 }, ptr %self, i32 0, i32 1
  store i32 %2, ptr %4, align 4
  store i8 1, ptr %_10, align 1
  store i8 1, ptr %_9, align 1
  %5 = load ptr, ptr %self, align 4, !noundef !0
  %6 = ptrtoint ptr %5 to i32
  %7 = icmp eq i32 %6, 0
  %_4 = select i1 %7, i32 0, i32 1
  %8 = icmp eq i32 %_4, 0
  br i1 %8, label %bb1, label %bb3

bb1:                                              ; preds = %start
  store i8 0, ptr %_10, align 1
; call alloc::fmt::format::{{closure}}
  call void @"_ZN5alloc3fmt6format28_$u7b$$u7b$closure$u7d$$u7d$17hc6ddcc8e36bc8f95E"(ptr sret(%"alloc::string::String") %0, ptr align 4 %default) #11
  br label %bb9

bb3:                                              ; preds = %start
  %9 = getelementptr inbounds { ptr, i32 }, ptr %self, i32 0, i32 0
  %t.0 = load ptr, ptr %9, align 4, !nonnull !0, !align !1, !noundef !0
  %10 = getelementptr inbounds { ptr, i32 }, ptr %self, i32 0, i32 1
  %t.1 = load i32, ptr %10, align 4, !noundef !0
  store i8 0, ptr %_9, align 1
  %11 = getelementptr inbounds { ptr, i32 }, ptr %_7, i32 0, i32 0
  store ptr %t.0, ptr %11, align 4
  %12 = getelementptr inbounds { ptr, i32 }, ptr %_7, i32 0, i32 1
  store i32 %t.1, ptr %12, align 4
  %13 = getelementptr inbounds { ptr, i32 }, ptr %_7, i32 0, i32 0
  %14 = load ptr, ptr %13, align 4, !nonnull !0, !align !1, !noundef !0
  %15 = getelementptr inbounds { ptr, i32 }, ptr %_7, i32 0, i32 1
  %16 = load i32, ptr %15, align 4, !noundef !0
; call core::ops::function::FnOnce::call_once
  call void @_ZN4core3ops8function6FnOnce9call_once17h76175315b1a4a029E(ptr sret(%"alloc::string::String") %0, ptr align 1 %14, i32 %16) #11
  br label %bb9

bb2:                                              ; No predecessors!
  unreachable

bb9:                                              ; preds = %bb1, %bb3
  %17 = load i8, ptr %_9, align 1, !range !3, !noundef !0
  %18 = trunc i8 %17 to i1
  br i1 %18, label %bb8, label %bb6

bb6:                                              ; preds = %bb8, %bb9
  %19 = load i8, ptr %_10, align 1, !range !3, !noundef !0
  %20 = trunc i8 %19 to i1
  br i1 %20, label %bb10, label %bb7

bb8:                                              ; preds = %bb9
  br label %bb6

bb7:                                              ; preds = %bb10, %bb6
  ret void

bb10:                                             ; preds = %bb6
  br label %bb7
}

; <T as alloc::slice::hack::ConvertVec>::to_vec
; Function Attrs: inlinehint nounwind
define hidden void @"_ZN52_$LT$T$u20$as$u20$alloc..slice..hack..ConvertVec$GT$6to_vec17h817e11de89a01deaE"(ptr sret(%"alloc::vec::Vec<u8>") %self, ptr align 1 %s.0, i32 %s.1) unnamed_addr #0 {
start:
; call alloc::raw_vec::RawVec<T,A>::allocate_in
  %0 = call { i32, ptr } @"_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$11allocate_in17h00c5902365d184b6E"(i32 %s.1, i1 zeroext false) #11
  %_10.0 = extractvalue { i32, ptr } %0, 0
  %_10.1 = extractvalue { i32, ptr } %0, 1
  %1 = getelementptr inbounds { i32, ptr }, ptr %self, i32 0, i32 0
  store i32 %_10.0, ptr %1, align 4
  %2 = getelementptr inbounds { i32, ptr }, ptr %self, i32 0, i32 1
  store ptr %_10.1, ptr %2, align 4
  %3 = getelementptr inbounds %"alloc::vec::Vec<u8>", ptr %self, i32 0, i32 1
  store i32 0, ptr %3, align 4
  %4 = getelementptr inbounds { i32, ptr }, ptr %self, i32 0, i32 1
  %self1 = load ptr, ptr %4, align 4, !nonnull !0, !noundef !0
  %5 = mul i32 %s.1, 1
  call void @llvm.memcpy.p0.p0.i32(ptr align 1 %self1, ptr align 1 %s.0, i32 %5, i1 false)
  %6 = getelementptr inbounds %"alloc::vec::Vec<u8>", ptr %self, i32 0, i32 1
  store i32 %s.1, ptr %6, align 4
  ret void
}

; alloc::fmt::format
; Function Attrs: inlinehint nounwind
define internal void @_ZN5alloc3fmt6format17h0af03bf24cb778f7E(ptr sret(%"alloc::string::String") %0, ptr %args) unnamed_addr #0 {
start:
  %_4 = alloca ptr, align 4
; call core::fmt::Arguments::as_str
  %1 = call { ptr, i32 } @_ZN4core3fmt9Arguments6as_str17hcba7911a2c3de106E(ptr align 4 %args) #11
  %_2.0 = extractvalue { ptr, i32 } %1, 0
  %_2.1 = extractvalue { ptr, i32 } %1, 1
  store ptr %args, ptr %_4, align 4
  %2 = load ptr, ptr %_4, align 4, !nonnull !0, !align !2, !noundef !0
; call core::option::Option<T>::map_or_else
  call void @"_ZN4core6option15Option$LT$T$GT$11map_or_else17h8ff28ae11dd34f42E"(ptr sret(%"alloc::string::String") %0, ptr align 1 %_2.0, i32 %_2.1, ptr align 4 %2) #11
  ret void
}

; alloc::fmt::format::{{closure}}
; Function Attrs: inlinehint nounwind
define hidden void @"_ZN5alloc3fmt6format28_$u7b$$u7b$closure$u7d$$u7d$17hc6ddcc8e36bc8f95E"(ptr sret(%"alloc::string::String") %0, ptr align 4 %1) unnamed_addr #0 {
start:
  %_2 = alloca %"core::fmt::Arguments<'_>", align 4
  %_1 = alloca ptr, align 4
  store ptr %1, ptr %_1, align 4
  %_3 = load ptr, ptr %_1, align 4, !nonnull !0, !align !2, !noundef !0
  call void @llvm.memcpy.p0.p0.i32(ptr align 4 %_2, ptr align 4 %_3, i32 24, i1 false)
; call alloc::fmt::format::format_inner
  call void @_ZN5alloc3fmt6format12format_inner17heaec38bcd72fc33aE(ptr sret(%"alloc::string::String") %0, ptr %_2) #11
  ret void
}

; alloc::str::<impl alloc::borrow::ToOwned for str>::to_owned
; Function Attrs: inlinehint nounwind
define internal void @"_ZN5alloc3str56_$LT$impl$u20$alloc..borrow..ToOwned$u20$for$u20$str$GT$8to_owned17hffcb4f6d4760ddccE"(ptr sret(%"alloc::string::String") %0, ptr align 1 %self.0, i32 %self.1) unnamed_addr #0 {
start:
  %bytes = alloca %"alloc::vec::Vec<u8>", align 4
; call alloc::slice::<impl alloc::borrow::ToOwned for [T]>::to_owned
  call void @"_ZN5alloc5slice64_$LT$impl$u20$alloc..borrow..ToOwned$u20$for$u20$$u5b$T$u5d$$GT$8to_owned17h579d7624ee18694bE"(ptr sret(%"alloc::vec::Vec<u8>") %bytes, ptr align 1 %self.0, i32 %self.1) #11
  call void @llvm.memcpy.p0.p0.i32(ptr align 4 %0, ptr align 4 %bytes, i32 12, i1 false)
  ret void
}

; alloc::alloc::Global::alloc_impl
; Function Attrs: inlinehint nounwind
define internal { ptr, i32 } @_ZN5alloc5alloc6Global10alloc_impl17hdc39a76139eaf3a9E(ptr align 1 %self, i32 %0, i32 %1, i1 zeroext %zeroed) unnamed_addr #0 {
start:
  %_77 = alloca { ptr, i32 }, align 4
  %_76 = alloca %"core::ptr::metadata::PtrRepr<[u8]>", align 4
  %_61 = alloca ptr, align 4
  %_60 = alloca ptr, align 4
  %_54 = alloca i32, align 4
  %_45 = alloca i32, align 4
  %_35 = alloca { ptr, i32 }, align 4
  %_34 = alloca %"core::ptr::metadata::PtrRepr<[u8]>", align 4
  %_22 = alloca i32, align 4
  %_18 = alloca { ptr, i32 }, align 4
  %self4 = alloca ptr, align 4
  %self3 = alloca ptr, align 4
  %_12 = alloca ptr, align 4
  %layout2 = alloca { i32, i32 }, align 4
  %layout1 = alloca { i32, i32 }, align 4
  %raw_ptr = alloca ptr, align 4
  %data = alloca ptr, align 4
  %_6 = alloca { ptr, i32 }, align 4
  %2 = alloca { ptr, i32 }, align 4
  %layout = alloca { i32, i32 }, align 4
  %3 = getelementptr inbounds { i32, i32 }, ptr %layout, i32 0, i32 0
  store i32 %0, ptr %3, align 4
  %4 = getelementptr inbounds { i32, i32 }, ptr %layout, i32 0, i32 1
  store i32 %1, ptr %4, align 4
  %size = load i32, ptr %layout, align 4, !noundef !0
  %5 = icmp eq i32 %size, 0
  br i1 %5, label %bb2, label %bb1

bb2:                                              ; preds = %start
  %6 = getelementptr inbounds { i32, i32 }, ptr %layout, i32 0, i32 1
  %self10 = load i32, ptr %6, align 4, !range !4, !noundef !0
  store i32 %self10, ptr %_22, align 4
  %_23 = load i32, ptr %_22, align 4, !range !4, !noundef !0
  %_24 = icmp uge i32 -2147483648, %_23
  call void @llvm.assume(i1 %_24)
  %_25 = icmp ule i32 1, %_23
  call void @llvm.assume(i1 %_25)
  %ptr11 = inttoptr i32 %_23 to ptr
  store ptr %ptr11, ptr %data, align 4
  %_32 = load ptr, ptr %data, align 4, !noundef !0
  store ptr %_32, ptr %_35, align 4
  %7 = getelementptr inbounds { ptr, i32 }, ptr %_35, i32 0, i32 1
  store i32 0, ptr %7, align 4
  %8 = getelementptr inbounds { ptr, i32 }, ptr %_35, i32 0, i32 0
  %9 = load ptr, ptr %8, align 4, !noundef !0
  %10 = getelementptr inbounds { ptr, i32 }, ptr %_35, i32 0, i32 1
  %11 = load i32, ptr %10, align 4, !noundef !0
  %12 = getelementptr inbounds { ptr, i32 }, ptr %_34, i32 0, i32 0
  store ptr %9, ptr %12, align 4
  %13 = getelementptr inbounds { ptr, i32 }, ptr %_34, i32 0, i32 1
  store i32 %11, ptr %13, align 4
  %14 = getelementptr inbounds { ptr, i32 }, ptr %_34, i32 0, i32 0
  %ptr.012 = load ptr, ptr %14, align 4, !noundef !0
  %15 = getelementptr inbounds { ptr, i32 }, ptr %_34, i32 0, i32 1
  %ptr.113 = load i32, ptr %15, align 4, !noundef !0
  %16 = getelementptr inbounds { ptr, i32 }, ptr %_6, i32 0, i32 0
  store ptr %ptr.012, ptr %16, align 4
  %17 = getelementptr inbounds { ptr, i32 }, ptr %_6, i32 0, i32 1
  store i32 %ptr.113, ptr %17, align 4
  %18 = getelementptr inbounds { ptr, i32 }, ptr %_6, i32 0, i32 0
  %19 = load ptr, ptr %18, align 4, !nonnull !0, !noundef !0
  %20 = getelementptr inbounds { ptr, i32 }, ptr %_6, i32 0, i32 1
  %21 = load i32, ptr %20, align 4, !noundef !0
  %22 = getelementptr inbounds { ptr, i32 }, ptr %2, i32 0, i32 0
  store ptr %19, ptr %22, align 4
  %23 = getelementptr inbounds { ptr, i32 }, ptr %2, i32 0, i32 1
  store i32 %21, ptr %23, align 4
  br label %bb10

bb1:                                              ; preds = %start
  br i1 %zeroed, label %bb3, label %bb4

bb4:                                              ; preds = %bb1
  %24 = getelementptr inbounds { i32, i32 }, ptr %layout, i32 0, i32 0
  %25 = load i32, ptr %24, align 4, !noundef !0
  %26 = getelementptr inbounds { i32, i32 }, ptr %layout, i32 0, i32 1
  %27 = load i32, ptr %26, align 4, !range !4, !noundef !0
  %28 = getelementptr inbounds { i32, i32 }, ptr %layout2, i32 0, i32 0
  store i32 %25, ptr %28, align 4
  %29 = getelementptr inbounds { i32, i32 }, ptr %layout2, i32 0, i32 1
  store i32 %27, ptr %29, align 4
  %_49 = load i32, ptr %layout2, align 4, !noundef !0
  %30 = getelementptr inbounds { i32, i32 }, ptr %layout2, i32 0, i32 1
  %self6 = load i32, ptr %30, align 4, !range !4, !noundef !0
  store i32 %self6, ptr %_54, align 4
  %_55 = load i32, ptr %_54, align 4, !range !4, !noundef !0
  %_56 = icmp uge i32 -2147483648, %_55
  call void @llvm.assume(i1 %_56)
  %_57 = icmp ule i32 1, %_55
  call void @llvm.assume(i1 %_57)
  %31 = call ptr @__rust_alloc(i32 %_49, i32 %_55) #11
  store ptr %31, ptr %raw_ptr, align 4
  br label %bb5

bb3:                                              ; preds = %bb1
  %32 = getelementptr inbounds { i32, i32 }, ptr %layout, i32 0, i32 0
  %33 = load i32, ptr %32, align 4, !noundef !0
  %34 = getelementptr inbounds { i32, i32 }, ptr %layout, i32 0, i32 1
  %35 = load i32, ptr %34, align 4, !range !4, !noundef !0
  %36 = getelementptr inbounds { i32, i32 }, ptr %layout1, i32 0, i32 0
  store i32 %33, ptr %36, align 4
  %37 = getelementptr inbounds { i32, i32 }, ptr %layout1, i32 0, i32 1
  store i32 %35, ptr %37, align 4
  %_40 = load i32, ptr %layout1, align 4, !noundef !0
  %38 = getelementptr inbounds { i32, i32 }, ptr %layout1, i32 0, i32 1
  %self5 = load i32, ptr %38, align 4, !range !4, !noundef !0
  store i32 %self5, ptr %_45, align 4
  %_46 = load i32, ptr %_45, align 4, !range !4, !noundef !0
  %_47 = icmp uge i32 -2147483648, %_46
  call void @llvm.assume(i1 %_47)
  %_48 = icmp ule i32 1, %_46
  call void @llvm.assume(i1 %_48)
  %39 = call ptr @__rust_alloc_zeroed(i32 %_40, i32 %_46) #11
  store ptr %39, ptr %raw_ptr, align 4
  br label %bb5

bb5:                                              ; preds = %bb4, %bb3
  %ptr = load ptr, ptr %raw_ptr, align 4, !noundef !0
  store ptr %ptr, ptr %_61, align 4
  %ptr7 = load ptr, ptr %_61, align 4, !noundef !0
  %_63 = ptrtoint ptr %ptr7 to i32
  %_59 = icmp eq i32 %_63, 0
  %_58 = xor i1 %_59, true
  br i1 %_58, label %bb13, label %bb14

bb14:                                             ; preds = %bb5
  store ptr null, ptr %self4, align 4
  br label %bb15

bb13:                                             ; preds = %bb5
  store ptr %ptr, ptr %_60, align 4
  %40 = load ptr, ptr %_60, align 4, !nonnull !0, !noundef !0
  store ptr %40, ptr %self4, align 4
  br label %bb15

bb15:                                             ; preds = %bb14, %bb13
  %41 = load ptr, ptr %self4, align 4, !noundef !0
  %42 = ptrtoint ptr %41 to i32
  %43 = icmp eq i32 %42, 0
  %_68 = select i1 %43, i32 0, i32 1
  %44 = icmp eq i32 %_68, 0
  br i1 %44, label %bb16, label %bb17

bb16:                                             ; preds = %bb15
  store ptr null, ptr %self3, align 4
  br label %bb18

bb17:                                             ; preds = %bb15
  %v = load ptr, ptr %self4, align 4, !nonnull !0, !noundef !0
  store ptr %v, ptr %self3, align 4
  br label %bb18

bb18:                                             ; preds = %bb16, %bb17
  %45 = load ptr, ptr %self3, align 4, !noundef !0
  %46 = ptrtoint ptr %45 to i32
  %47 = icmp eq i32 %46, 0
  %_70 = select i1 %47, i32 1, i32 0
  %48 = icmp eq i32 %_70, 0
  br i1 %48, label %bb20, label %bb19

bb20:                                             ; preds = %bb18
  %v8 = load ptr, ptr %self3, align 4, !nonnull !0, !noundef !0
  store ptr %v8, ptr %_12, align 4
  br label %bb6

bb19:                                             ; preds = %bb18
  store ptr null, ptr %_12, align 4
  br label %bb6

bb6:                                              ; preds = %bb20, %bb19
  %49 = load ptr, ptr %_12, align 4, !noundef !0
  %50 = ptrtoint ptr %49 to i32
  %51 = icmp eq i32 %50, 0
  %_16 = select i1 %51, i32 1, i32 0
  %52 = icmp eq i32 %_16, 0
  br i1 %52, label %bb7, label %bb9

bb7:                                              ; preds = %bb6
  %ptr9 = load ptr, ptr %_12, align 4, !nonnull !0, !noundef !0
  store ptr %ptr9, ptr %_77, align 4
  %53 = getelementptr inbounds { ptr, i32 }, ptr %_77, i32 0, i32 1
  store i32 %size, ptr %53, align 4
  %54 = getelementptr inbounds { ptr, i32 }, ptr %_77, i32 0, i32 0
  %55 = load ptr, ptr %54, align 4, !noundef !0
  %56 = getelementptr inbounds { ptr, i32 }, ptr %_77, i32 0, i32 1
  %57 = load i32, ptr %56, align 4, !noundef !0
  %58 = getelementptr inbounds { ptr, i32 }, ptr %_76, i32 0, i32 0
  store ptr %55, ptr %58, align 4
  %59 = getelementptr inbounds { ptr, i32 }, ptr %_76, i32 0, i32 1
  store i32 %57, ptr %59, align 4
  %60 = getelementptr inbounds { ptr, i32 }, ptr %_76, i32 0, i32 0
  %ptr.0 = load ptr, ptr %60, align 4, !noundef !0
  %61 = getelementptr inbounds { ptr, i32 }, ptr %_76, i32 0, i32 1
  %ptr.1 = load i32, ptr %61, align 4, !noundef !0
  %62 = getelementptr inbounds { ptr, i32 }, ptr %_18, i32 0, i32 0
  store ptr %ptr.0, ptr %62, align 4
  %63 = getelementptr inbounds { ptr, i32 }, ptr %_18, i32 0, i32 1
  store i32 %ptr.1, ptr %63, align 4
  %64 = getelementptr inbounds { ptr, i32 }, ptr %_18, i32 0, i32 0
  %65 = load ptr, ptr %64, align 4, !nonnull !0, !noundef !0
  %66 = getelementptr inbounds { ptr, i32 }, ptr %_18, i32 0, i32 1
  %67 = load i32, ptr %66, align 4, !noundef !0
  %68 = getelementptr inbounds { ptr, i32 }, ptr %2, i32 0, i32 0
  store ptr %65, ptr %68, align 4
  %69 = getelementptr inbounds { ptr, i32 }, ptr %2, i32 0, i32 1
  store i32 %67, ptr %69, align 4
  br label %bb10

bb9:                                              ; preds = %bb6
  store ptr null, ptr %2, align 4
  br label %bb10

bb8:                                              ; No predecessors!
  unreachable

bb10:                                             ; preds = %bb2, %bb7, %bb9
  %70 = getelementptr inbounds { ptr, i32 }, ptr %2, i32 0, i32 0
  %71 = load ptr, ptr %70, align 4, !noundef !0
  %72 = getelementptr inbounds { ptr, i32 }, ptr %2, i32 0, i32 1
  %73 = load i32, ptr %72, align 4
  %74 = insertvalue { ptr, i32 } poison, ptr %71, 0
  %75 = insertvalue { ptr, i32 } %74, i32 %73, 1
  ret { ptr, i32 } %75
}

; alloc::slice::<impl alloc::borrow::ToOwned for [T]>::to_owned
; Function Attrs: nounwind
define hidden void @"_ZN5alloc5slice64_$LT$impl$u20$alloc..borrow..ToOwned$u20$for$u20$$u5b$T$u5d$$GT$8to_owned17h579d7624ee18694bE"(ptr sret(%"alloc::vec::Vec<u8>") %0, ptr align 1 %self.0, i32 %self.1) unnamed_addr #1 {
start:
; call <T as alloc::slice::hack::ConvertVec>::to_vec
  call void @"_ZN52_$LT$T$u20$as$u20$alloc..slice..hack..ConvertVec$GT$6to_vec17h817e11de89a01deaE"(ptr sret(%"alloc::vec::Vec<u8>") %0, ptr align 1 %self.0, i32 %self.1) #11
  ret void
}

; alloc::raw_vec::RawVec<T,A>::allocate_in
; Function Attrs: nounwind
define hidden { i32, ptr } @"_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$11allocate_in17h00c5902365d184b6E"(i32 %capacity, i1 zeroext %0) unnamed_addr #1 {
start:
  %_43 = alloca ptr, align 4
  %self1 = alloca { i32, i32 }, align 4
  %_34 = alloca { i32, i32 }, align 4
  %self = alloca ptr, align 4
  %_24 = alloca ptr, align 4
  %result = alloca { ptr, i32 }, align 4
  %_12 = alloca { i32, i32 }, align 4
  %_8 = alloca { i32, i32 }, align 4
  %layout = alloca { i32, i32 }, align 4
  %_4 = alloca i8, align 1
  %1 = alloca { i32, ptr }, align 4
  %alloc = alloca %"alloc::alloc::Global", align 1
  %init = alloca i8, align 1
  %2 = zext i1 %0 to i8
  store i8 %2, ptr %init, align 1
  br i1 false, label %bb1, label %bb2

bb2:                                              ; preds = %start
  %_5 = icmp eq i32 %capacity, 0
  %3 = zext i1 %_5 to i8
  store i8 %3, ptr %_4, align 1
  br label %bb3

bb1:                                              ; preds = %start
  store i8 1, ptr %_4, align 1
  br label %bb3

bb3:                                              ; preds = %bb2, %bb1
  %4 = load i8, ptr %_4, align 1, !range !3, !noundef !0
  %5 = trunc i8 %4 to i1
  br i1 %5, label %bb4, label %bb6

bb6:                                              ; preds = %bb3
; call core::alloc::layout::Layout::array::inner
  %6 = call { i32, i32 } @_ZN4core5alloc6layout6Layout5array5inner17he866cbf4c6480e44E(i32 1, i32 1, i32 %capacity) #11
  store { i32, i32 } %6, ptr %_8, align 4
  %7 = getelementptr inbounds { i32, i32 }, ptr %_8, i32 0, i32 1
  %8 = load i32, ptr %7, align 4, !range !5, !noundef !0
  %9 = icmp eq i32 %8, 0
  %_9 = select i1 %9, i32 1, i32 0
  %10 = icmp eq i32 %_9, 0
  br i1 %10, label %bb9, label %bb7

bb4:                                              ; preds = %bb3
; call alloc::raw_vec::RawVec<T,A>::new_in
  %11 = call { i32, ptr } @"_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$6new_in17h839effade792c2cfE"() #11
  store { i32, ptr } %11, ptr %1, align 4
  br label %bb19

bb19:                                             ; preds = %bb18, %bb4
  %12 = getelementptr inbounds { i32, ptr }, ptr %1, i32 0, i32 0
  %13 = load i32, ptr %12, align 4, !noundef !0
  %14 = getelementptr inbounds { i32, ptr }, ptr %1, i32 0, i32 1
  %15 = load ptr, ptr %14, align 4, !nonnull !0, !noundef !0
  %16 = insertvalue { i32, ptr } poison, i32 %13, 0
  %17 = insertvalue { i32, ptr } %16, ptr %15, 1
  ret { i32, ptr } %17

bb9:                                              ; preds = %bb6
  %18 = getelementptr inbounds { i32, i32 }, ptr %_8, i32 0, i32 0
  %layout.0 = load i32, ptr %18, align 4, !noundef !0
  %19 = getelementptr inbounds { i32, i32 }, ptr %_8, i32 0, i32 1
  %layout.1 = load i32, ptr %19, align 4, !range !4, !noundef !0
  %20 = getelementptr inbounds { i32, i32 }, ptr %layout, i32 0, i32 0
  store i32 %layout.0, ptr %20, align 4
  %21 = getelementptr inbounds { i32, i32 }, ptr %layout, i32 0, i32 1
  store i32 %layout.1, ptr %21, align 4
  %alloc_size = load i32, ptr %layout, align 4, !noundef !0
  %_32 = icmp ugt i32 %alloc_size, 2147483647
  br i1 %_32, label %bb21, label %bb22

bb7:                                              ; preds = %bb6
; call alloc::raw_vec::capacity_overflow
  call void @_ZN5alloc7raw_vec17capacity_overflow17h3bb4537b5f9f8404E() #12
  unreachable

bb22:                                             ; preds = %bb9
  %22 = getelementptr inbounds { i32, i32 }, ptr %_12, i32 0, i32 1
  store i32 -2147483647, ptr %22, align 4
  br label %bb23

bb21:                                             ; preds = %bb9
  %23 = getelementptr inbounds { i32, i32 }, ptr %self1, i32 0, i32 1
  store i32 0, ptr %23, align 4
  %24 = getelementptr inbounds { i32, i32 }, ptr %self1, i32 0, i32 0
  %25 = load i32, ptr %24, align 4
  %26 = getelementptr inbounds { i32, i32 }, ptr %self1, i32 0, i32 1
  %27 = load i32, ptr %26, align 4, !range !5, !noundef !0
  %28 = getelementptr inbounds { i32, i32 }, ptr %_34, i32 0, i32 0
  store i32 %25, ptr %28, align 4
  %29 = getelementptr inbounds { i32, i32 }, ptr %_34, i32 0, i32 1
  store i32 %27, ptr %29, align 4
  %30 = getelementptr inbounds { i32, i32 }, ptr %_34, i32 0, i32 0
  %31 = load i32, ptr %30, align 4
  %32 = getelementptr inbounds { i32, i32 }, ptr %_34, i32 0, i32 1
  %33 = load i32, ptr %32, align 4, !range !5, !noundef !0
  %34 = getelementptr inbounds { i32, i32 }, ptr %_12, i32 0, i32 0
  store i32 %31, ptr %34, align 4
  %35 = getelementptr inbounds { i32, i32 }, ptr %_12, i32 0, i32 1
  store i32 %33, ptr %35, align 4
  br label %bb23

bb23:                                             ; preds = %bb22, %bb21
  %36 = getelementptr inbounds { i32, i32 }, ptr %_12, i32 0, i32 1
  %37 = load i32, ptr %36, align 4, !range !6, !noundef !0
  %38 = icmp eq i32 %37, -2147483647
  %_15 = select i1 %38, i32 0, i32 1
  %39 = icmp eq i32 %_15, 0
  br i1 %39, label %bb11, label %bb10

bb11:                                             ; preds = %bb23
  %40 = load i8, ptr %init, align 1, !range !3, !noundef !0
  %41 = trunc i8 %40 to i1
  %_18 = zext i1 %41 to i32
  %42 = icmp eq i32 %_18, 0
  br i1 %42, label %bb13, label %bb12

bb10:                                             ; preds = %bb23
; call alloc::raw_vec::capacity_overflow
  call void @_ZN5alloc7raw_vec17capacity_overflow17h3bb4537b5f9f8404E() #12
  unreachable

bb13:                                             ; preds = %bb11
; call <alloc::alloc::Global as core::alloc::Allocator>::allocate
  %43 = call { ptr, i32 } @"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$8allocate17h08bb5db34989431dE"(ptr align 1 %alloc, i32 %layout.0, i32 %layout.1) #11
  store { ptr, i32 } %43, ptr %result, align 4
  br label %bb16

bb12:                                             ; preds = %bb11
; call <alloc::alloc::Global as core::alloc::Allocator>::allocate_zeroed
  %44 = call { ptr, i32 } @"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$15allocate_zeroed17h778db7241e549b1aE"(ptr align 1 %alloc, i32 %layout.0, i32 %layout.1) #11
  store { ptr, i32 } %44, ptr %result, align 4
  br label %bb16

bb16:                                             ; preds = %bb13, %bb12
  %45 = load ptr, ptr %result, align 4, !noundef !0
  %46 = ptrtoint ptr %45 to i32
  %47 = icmp eq i32 %46, 0
  %_21 = select i1 %47, i32 1, i32 0
  %48 = icmp eq i32 %_21, 0
  br i1 %48, label %bb18, label %bb17

bb18:                                             ; preds = %bb16
  %49 = getelementptr inbounds { ptr, i32 }, ptr %result, i32 0, i32 0
  %ptr.0 = load ptr, ptr %49, align 4, !nonnull !0, !noundef !0
  %50 = getelementptr inbounds { ptr, i32 }, ptr %result, i32 0, i32 1
  %ptr.1 = load i32, ptr %50, align 4, !noundef !0
  store ptr %ptr.0, ptr %self, align 4
  %_42 = load ptr, ptr %self, align 4, !noundef !0
  store ptr %_42, ptr %_43, align 4
  %51 = load ptr, ptr %_43, align 4, !nonnull !0, !noundef !0
  store ptr %51, ptr %_24, align 4
  %52 = load ptr, ptr %_24, align 4, !nonnull !0, !noundef !0
  %53 = getelementptr inbounds { i32, ptr }, ptr %1, i32 0, i32 1
  store ptr %52, ptr %53, align 4
  store i32 %capacity, ptr %1, align 4
  br label %bb19

bb17:                                             ; preds = %bb16
; call alloc::alloc::handle_alloc_error
  call void @_ZN5alloc5alloc18handle_alloc_error17h4f440fe326a4450dE(i32 %layout.0, i32 %layout.1) #12
  unreachable

bb8:                                              ; No predecessors!
  unreachable
}

; alloc::raw_vec::RawVec<T,A>::current_memory
; Function Attrs: nounwind
define hidden void @"_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$14current_memory17hcdfef65abacaf9a6E"(ptr sret(%"core::option::Option<(core::ptr::non_null::NonNull<u8>, core::alloc::layout::Layout)>") %0, ptr align 4 %self) unnamed_addr #1 {
start:
  %1 = alloca i32, align 4
  %pointer = alloca ptr, align 4
  %self1 = alloca ptr, align 4
  %_12 = alloca ptr, align 4
  %_11 = alloca { ptr, { i32, i32 } }, align 4
  %layout = alloca { i32, i32 }, align 4
  %_2 = alloca i8, align 1
  br i1 false, label %bb1, label %bb2

bb2:                                              ; preds = %start
  %_4 = load i32, ptr %self, align 4, !noundef !0
  %_3 = icmp eq i32 %_4, 0
  %2 = zext i1 %_3 to i8
  store i8 %2, ptr %_2, align 1
  br label %bb3

bb1:                                              ; preds = %start
  store i8 1, ptr %_2, align 1
  br label %bb3

bb3:                                              ; preds = %bb2, %bb1
  %3 = load i8, ptr %_2, align 1, !range !3, !noundef !0
  %4 = trunc i8 %3 to i1
  br i1 %4, label %bb4, label %bb5

bb5:                                              ; preds = %bb3
  %rhs = load i32, ptr %self, align 4, !noundef !0
  %5 = mul nuw i32 1, %rhs
  store i32 %5, ptr %1, align 4
  %size = load i32, ptr %1, align 4, !noundef !0
  store i32 %size, ptr %layout, align 4
  %6 = getelementptr inbounds { i32, i32 }, ptr %layout, i32 0, i32 1
  store i32 1, ptr %6, align 4
  %7 = getelementptr inbounds { i32, ptr }, ptr %self, i32 0, i32 1
  %self2 = load ptr, ptr %7, align 4, !nonnull !0, !noundef !0
  store ptr %self2, ptr %pointer, align 4
  %8 = load ptr, ptr %pointer, align 4, !nonnull !0, !noundef !0
  store ptr %8, ptr %self1, align 4
  %self3 = load ptr, ptr %self1, align 4, !nonnull !0, !noundef !0
  store ptr %self3, ptr %_12, align 4
  %9 = load ptr, ptr %_12, align 4, !nonnull !0, !noundef !0
  store ptr %9, ptr %_11, align 4
  %10 = getelementptr inbounds { i32, i32 }, ptr %layout, i32 0, i32 0
  %11 = load i32, ptr %10, align 4, !noundef !0
  %12 = getelementptr inbounds { i32, i32 }, ptr %layout, i32 0, i32 1
  %13 = load i32, ptr %12, align 4, !range !4, !noundef !0
  %14 = getelementptr inbounds { ptr, { i32, i32 } }, ptr %_11, i32 0, i32 1
  %15 = getelementptr inbounds { i32, i32 }, ptr %14, i32 0, i32 0
  store i32 %11, ptr %15, align 4
  %16 = getelementptr inbounds { i32, i32 }, ptr %14, i32 0, i32 1
  store i32 %13, ptr %16, align 4
  call void @llvm.memcpy.p0.p0.i32(ptr align 4 %0, ptr align 4 %_11, i32 12, i1 false)
  br label %bb6

bb4:                                              ; preds = %bb3
  %17 = getelementptr inbounds %"core::option::Option<(core::ptr::non_null::NonNull<u8>, core::alloc::layout::Layout)>", ptr %0, i32 0, i32 1
  store i32 0, ptr %17, align 4
  br label %bb6

bb6:                                              ; preds = %bb5, %bb4
  ret void
}

; alloc::raw_vec::RawVec<T,A>::new_in
; Function Attrs: nounwind
define hidden { i32, ptr } @"_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$6new_in17h839effade792c2cfE"() unnamed_addr #1 {
start:
  %pointer = alloca ptr, align 4
  %_2 = alloca ptr, align 4
  %0 = alloca { i32, ptr }, align 4
  store ptr inttoptr (i32 1 to ptr), ptr %pointer, align 4
  %1 = load ptr, ptr %pointer, align 4, !nonnull !0, !noundef !0
  store ptr %1, ptr %_2, align 4
  %2 = load ptr, ptr %_2, align 4, !nonnull !0, !noundef !0
  %3 = getelementptr inbounds { i32, ptr }, ptr %0, i32 0, i32 1
  store ptr %2, ptr %3, align 4
  store i32 0, ptr %0, align 4
  %4 = getelementptr inbounds { i32, ptr }, ptr %0, i32 0, i32 0
  %5 = load i32, ptr %4, align 4, !noundef !0
  %6 = getelementptr inbounds { i32, ptr }, ptr %0, i32 0, i32 1
  %7 = load ptr, ptr %6, align 4, !nonnull !0, !noundef !0
  %8 = insertvalue { i32, ptr } poison, i32 %5, 0
  %9 = insertvalue { i32, ptr } %8, ptr %7, 1
  ret { i32, ptr } %9
}

; <alloc::alloc::Global as core::alloc::Allocator>::deallocate
; Function Attrs: inlinehint nounwind
define internal void @"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h1e542c99032c5bceE"(ptr align 1 %self, ptr %ptr, i32 %0, i32 %1) unnamed_addr #0 {
start:
  %_14 = alloca i32, align 4
  %layout1 = alloca { i32, i32 }, align 4
  %layout = alloca { i32, i32 }, align 4
  %2 = getelementptr inbounds { i32, i32 }, ptr %layout, i32 0, i32 0
  store i32 %0, ptr %2, align 4
  %3 = getelementptr inbounds { i32, i32 }, ptr %layout, i32 0, i32 1
  store i32 %1, ptr %3, align 4
  %_4 = load i32, ptr %layout, align 4, !noundef !0
  %4 = icmp eq i32 %_4, 0
  br i1 %4, label %bb2, label %bb1

bb2:                                              ; preds = %start
  br label %bb3

bb1:                                              ; preds = %start
  %5 = getelementptr inbounds { i32, i32 }, ptr %layout, i32 0, i32 0
  %6 = load i32, ptr %5, align 4, !noundef !0
  %7 = getelementptr inbounds { i32, i32 }, ptr %layout, i32 0, i32 1
  %8 = load i32, ptr %7, align 4, !range !4, !noundef !0
  %9 = getelementptr inbounds { i32, i32 }, ptr %layout1, i32 0, i32 0
  store i32 %6, ptr %9, align 4
  %10 = getelementptr inbounds { i32, i32 }, ptr %layout1, i32 0, i32 1
  store i32 %8, ptr %10, align 4
  %_9 = load i32, ptr %layout1, align 4, !noundef !0
  %11 = getelementptr inbounds { i32, i32 }, ptr %layout1, i32 0, i32 1
  %self2 = load i32, ptr %11, align 4, !range !4, !noundef !0
  store i32 %self2, ptr %_14, align 4
  %_15 = load i32, ptr %_14, align 4, !range !4, !noundef !0
  %_16 = icmp uge i32 -2147483648, %_15
  call void @llvm.assume(i1 %_16)
  %_17 = icmp ule i32 1, %_15
  call void @llvm.assume(i1 %_17)
  call void @__rust_dealloc(ptr %ptr, i32 %_9, i32 %_15) #11
  br label %bb3

bb3:                                              ; preds = %bb2, %bb1
  ret void
}

; <alloc::alloc::Global as core::alloc::Allocator>::allocate_zeroed
; Function Attrs: inlinehint nounwind
define internal { ptr, i32 } @"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$15allocate_zeroed17h778db7241e549b1aE"(ptr align 1 %self, i32 %layout.0, i32 %layout.1) unnamed_addr #0 {
start:
; call alloc::alloc::Global::alloc_impl
  %0 = call { ptr, i32 } @_ZN5alloc5alloc6Global10alloc_impl17hdc39a76139eaf3a9E(ptr align 1 %self, i32 %layout.0, i32 %layout.1, i1 zeroext true) #11
  %1 = extractvalue { ptr, i32 } %0, 0
  %2 = extractvalue { ptr, i32 } %0, 1
  %3 = insertvalue { ptr, i32 } poison, ptr %1, 0
  %4 = insertvalue { ptr, i32 } %3, i32 %2, 1
  ret { ptr, i32 } %4
}

; <alloc::alloc::Global as core::alloc::Allocator>::allocate
; Function Attrs: inlinehint nounwind
define internal { ptr, i32 } @"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$8allocate17h08bb5db34989431dE"(ptr align 1 %self, i32 %layout.0, i32 %layout.1) unnamed_addr #0 {
start:
; call alloc::alloc::Global::alloc_impl
  %0 = call { ptr, i32 } @_ZN5alloc5alloc6Global10alloc_impl17hdc39a76139eaf3a9E(ptr align 1 %self, i32 %layout.0, i32 %layout.1, i1 zeroext false) #11
  %1 = extractvalue { ptr, i32 } %0, 0
  %2 = extractvalue { ptr, i32 } %0, 1
  %3 = insertvalue { ptr, i32 } poison, ptr %1, 0
  %4 = insertvalue { ptr, i32 } %3, i32 %2, 1
  ret { ptr, i32 } %4
}

; <alloc::vec::Vec<T,A> as core::ops::drop::Drop>::drop
; Function Attrs: nounwind
define hidden void @"_ZN70_$LT$alloc..vec..Vec$LT$T$C$A$GT$$u20$as$u20$core..ops..drop..Drop$GT$4drop17h6c3d8b8884340d4bE"(ptr align 4 %self) unnamed_addr #1 {
start:
  %_11 = alloca { ptr, i32 }, align 4
  %_10 = alloca %"core::ptr::metadata::PtrRepr<[u8]>", align 4
  %0 = getelementptr inbounds { i32, ptr }, ptr %self, i32 0, i32 1
  %self1 = load ptr, ptr %0, align 4, !nonnull !0, !noundef !0
  %1 = getelementptr inbounds %"alloc::vec::Vec<u8>", ptr %self, i32 0, i32 1
  %len = load i32, ptr %1, align 4, !noundef !0
  store ptr %self1, ptr %_11, align 4
  %2 = getelementptr inbounds { ptr, i32 }, ptr %_11, i32 0, i32 1
  store i32 %len, ptr %2, align 4
  %3 = getelementptr inbounds { ptr, i32 }, ptr %_11, i32 0, i32 0
  %4 = load ptr, ptr %3, align 4, !noundef !0
  %5 = getelementptr inbounds { ptr, i32 }, ptr %_11, i32 0, i32 1
  %6 = load i32, ptr %5, align 4, !noundef !0
  %7 = getelementptr inbounds { ptr, i32 }, ptr %_10, i32 0, i32 0
  store ptr %4, ptr %7, align 4
  %8 = getelementptr inbounds { ptr, i32 }, ptr %_10, i32 0, i32 1
  store i32 %6, ptr %8, align 4
  %9 = getelementptr inbounds { ptr, i32 }, ptr %_10, i32 0, i32 0
  %_2.0 = load ptr, ptr %9, align 4, !noundef !0
  %10 = getelementptr inbounds { ptr, i32 }, ptr %_10, i32 0, i32 1
  %_2.1 = load i32, ptr %10, align 4, !noundef !0
  ret void
}

; <alloc::raw_vec::RawVec<T,A> as core::ops::drop::Drop>::drop
; Function Attrs: nounwind
define hidden void @"_ZN77_$LT$alloc..raw_vec..RawVec$LT$T$C$A$GT$$u20$as$u20$core..ops..drop..Drop$GT$4drop17h8cd1f70b86eae699E"(ptr align 4 %self) unnamed_addr #1 {
start:
  %_2 = alloca %"core::option::Option<(core::ptr::non_null::NonNull<u8>, core::alloc::layout::Layout)>", align 4
; call alloc::raw_vec::RawVec<T,A>::current_memory
  call void @"_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$14current_memory17hcdfef65abacaf9a6E"(ptr sret(%"core::option::Option<(core::ptr::non_null::NonNull<u8>, core::alloc::layout::Layout)>") %_2, ptr align 4 %self) #11
  %0 = getelementptr inbounds %"core::option::Option<(core::ptr::non_null::NonNull<u8>, core::alloc::layout::Layout)>", ptr %_2, i32 0, i32 1
  %1 = load i32, ptr %0, align 4, !range !5, !noundef !0
  %2 = icmp eq i32 %1, 0
  %_4 = select i1 %2, i32 0, i32 1
  %3 = icmp eq i32 %_4, 1
  br i1 %3, label %bb2, label %bb4

bb2:                                              ; preds = %start
  %ptr = load ptr, ptr %_2, align 4, !nonnull !0, !noundef !0
  %4 = getelementptr inbounds { ptr, { i32, i32 } }, ptr %_2, i32 0, i32 1
  %5 = getelementptr inbounds { i32, i32 }, ptr %4, i32 0, i32 0
  %layout.0 = load i32, ptr %5, align 4, !noundef !0
  %6 = getelementptr inbounds { i32, i32 }, ptr %4, i32 0, i32 1
  %layout.1 = load i32, ptr %6, align 4, !range !4, !noundef !0
; call <alloc::alloc::Global as core::alloc::Allocator>::deallocate
  call void @"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h1e542c99032c5bceE"(ptr align 1 %self, ptr %ptr, i32 %layout.0, i32 %layout.1) #11
  br label %bb4

bb4:                                              ; preds = %bb2, %start
  ret void
}

; probe1::probe
; Function Attrs: nounwind
define hidden void @_ZN6probe15probe17h1762f0cda78aa6a3E() unnamed_addr #1 {
start:
  %_7 = alloca [1 x { ptr, ptr }], align 4
  %_3 = alloca %"core::fmt::Arguments<'_>", align 4
  %res = alloca %"alloc::string::String", align 4
  %_1 = alloca %"alloc::string::String", align 4
; call core::fmt::ArgumentV1::new_lower_exp
  %0 = call { ptr, ptr } @_ZN4core3fmt10ArgumentV113new_lower_exp17h0507bf28dbe4a85bE(ptr align 4 @alloc_83ea17bf0c4f4a5a5a13d3ae7955acd0) #11
  %_8.0 = extractvalue { ptr, ptr } %0, 0
  %_8.1 = extractvalue { ptr, ptr } %0, 1
  %1 = getelementptr inbounds [1 x { ptr, ptr }], ptr %_7, i32 0, i32 0
  %2 = getelementptr inbounds { ptr, ptr }, ptr %1, i32 0, i32 0
  store ptr %_8.0, ptr %2, align 4
  %3 = getelementptr inbounds { ptr, ptr }, ptr %1, i32 0, i32 1
  store ptr %_8.1, ptr %3, align 4
; call core::fmt::Arguments::new_v1
  call void @_ZN4core3fmt9Arguments6new_v117hc1e0edc46c3eebf5E(ptr sret(%"core::fmt::Arguments<'_>") %_3, ptr align 4 @alloc_97350e8bf483c1fe1c3a218b02d80fb1, i32 1, ptr align 4 %_7, i32 1) #11
; call alloc::fmt::format
  call void @_ZN5alloc3fmt6format17h0af03bf24cb778f7E(ptr sret(%"alloc::string::String") %res, ptr %_3) #11
  call void @llvm.memcpy.p0.p0.i32(ptr align 4 %_1, ptr align 4 %res, i32 12, i1 false)
; call core::ptr::drop_in_place<alloc::string::String>
  call void @"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h7d15a4fe99eb480cE"(ptr %_1) #11
  ret void
}

; core::fmt::num::imp::<impl core::fmt::LowerExp for isize>::fmt
; Function Attrs: nounwind
declare dso_local zeroext i1 @"_ZN4core3fmt3num3imp55_$LT$impl$u20$core..fmt..LowerExp$u20$for$u20$isize$GT$3fmt17hbc085530dd3b9514E"(ptr align 4, ptr align 4) unnamed_addr #1

; core::panicking::panic_fmt
; Function Attrs: cold noinline noreturn nounwind
declare dso_local void @_ZN4core9panicking9panic_fmt17hf5c4cd929d4aaa9eE(ptr, ptr align 4) unnamed_addr #2

; Function Attrs: nocallback nofree nosync nounwind willreturn memory(inaccessiblemem: readwrite)
declare hidden void @llvm.assume(i1 noundef) #3

; Function Attrs: nocallback nofree nosync nounwind willreturn memory(none)
declare hidden i1 @llvm.expect.i1(i1, i1) #4

; core::panicking::panic
; Function Attrs: cold noinline noreturn nounwind
declare dso_local void @_ZN4core9panicking5panic17h2f041bf6aa990dfdE(ptr align 1, i32, ptr align 4) unnamed_addr #2

; Function Attrs: nocallback nofree nounwind willreturn memory(argmem: readwrite)
declare void @llvm.memcpy.p0.p0.i32(ptr noalias nocapture writeonly, ptr noalias nocapture readonly, i32, i1 immarg) #5

; alloc::fmt::format::format_inner
; Function Attrs: nounwind
declare dso_local void @_ZN5alloc3fmt6format12format_inner17heaec38bcd72fc33aE(ptr sret(%"alloc::string::String"), ptr) unnamed_addr #1

; Function Attrs: nounwind allockind("alloc,zeroed,aligned") allocsize(0)
declare dso_local noalias ptr @__rust_alloc_zeroed(i32, i32 allocalign) unnamed_addr #6

; Function Attrs: nounwind allockind("alloc,uninitialized,aligned") allocsize(0)
declare dso_local noalias ptr @__rust_alloc(i32, i32 allocalign) unnamed_addr #7

; alloc::raw_vec::capacity_overflow
; Function Attrs: noreturn nounwind
declare dso_local void @_ZN5alloc7raw_vec17capacity_overflow17h3bb4537b5f9f8404E() unnamed_addr #8

; alloc::alloc::handle_alloc_error
; Function Attrs: cold noreturn nounwind
declare dso_local void @_ZN5alloc5alloc18handle_alloc_error17h4f440fe326a4450dE(i32, i32) unnamed_addr #9

; Function Attrs: nounwind allockind("free")
declare dso_local void @__rust_dealloc(ptr allocptr, i32, i32) unnamed_addr #10

attributes #0 = { inlinehint nounwind "target-cpu"="generic" }
attributes #1 = { nounwind "target-cpu"="generic" }
attributes #2 = { cold noinline noreturn nounwind "target-cpu"="generic" }
attributes #3 = { nocallback nofree nosync nounwind willreturn memory(inaccessiblemem: readwrite) }
attributes #4 = { nocallback nofree nosync nounwind willreturn memory(none) }
attributes #5 = { nocallback nofree nounwind willreturn memory(argmem: readwrite) }
attributes #6 = { nounwind allockind("alloc,zeroed,aligned") allocsize(0) "alloc-family"="__rust_alloc" "target-cpu"="generic" }
attributes #7 = { nounwind allockind("alloc,uninitialized,aligned") allocsize(0) "alloc-family"="__rust_alloc" "target-cpu"="generic" }
attributes #8 = { noreturn nounwind "target-cpu"="generic" }
attributes #9 = { cold noreturn nounwind "target-cpu"="generic" }
attributes #10 = { nounwind allockind("free") "alloc-family"="__rust_alloc" "target-cpu"="generic" }
attributes #11 = { nounwind }
attributes #12 = { noreturn nounwind }

!0 = !{}
!1 = !{i64 1}
!2 = !{i64 4}
!3 = !{i8 0, i8 2}
!4 = !{i32 1, i32 -2147483647}
!5 = !{i32 0, i32 -2147483647}
!6 = !{i32 0, i32 -2147483646}
