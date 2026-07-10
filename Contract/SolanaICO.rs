use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount, Transfer};

declare_id!("5izfVQfEfa2LXvopdJBp7SrdNHA6FaB8mptfd7svHSRW");

pub const IPO_MINT_ADDRESS: &str = "Aw76qq1jgcEU5ahtmKUpWKoL5hjsqaBkvZNBdHnXzpAi";
pub const LAMPORTS_PER_SOL: u64 = 1_000_000_000;
pub const TOKEN_DECIMALS: u64 = 1_000_000_000;

#[error_code]
pub enum ErrorCode {
    #[msg("Arithmetic overflow")]
    Overflow,

    #[msg("Invalid admin")]
    InvalidAdmin,
}

#[program]
pub mod ipo {
    use super::*;

    pub fn create_ipo_ata(
        ctx: Context<CreateIpoATA>,
        ico_amount: u64,
    ) -> Result<()> {

        msg!("Creating program ATA to hold IPO tokens");

        let raw_amount = ico_amount
            .checked_mul(TOKEN_DECIMALS)
            .ok_or(ErrorCode::Overflow)?;

        let cpi_ctx = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.ipo_ata_for_admin.to_account_info(),
                to: ctx.accounts.ipo_ata_for_ipo_program.to_account_info(),
                authority: ctx.accounts.admin.to_account_info(),
            },
        );

        token::transfer(cpi_ctx, raw_amount)?;

        let data = &mut ctx.accounts.data;

        data.admin = ctx.accounts.admin.key();
        data.total_tokens = ico_amount;
        data.total_sold = 0;

        msg!("Initialized IPO data");

        Ok(())
    }


    pub fn deposit_ipo_ata(
        ctx: Context<DepositIpoATA>,
        ipo_amount: u64,
    ) -> Result<()> {

        if ctx.accounts.data.admin != ctx.accounts.admin.key() {
            return Err(ErrorCode::InvalidAdmin.into());
        }

        let raw_amount = ipo_amount
            .checked_mul(TOKEN_DECIMALS)
            .ok_or(ErrorCode::Overflow)?;

        let cpi_ctx = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.ipo_ata_for_admin.to_account_info(),
                to: ctx.accounts.ipo_ata_for_ipo_program.to_account_info(),
                authority: ctx.accounts.admin.to_account_info(),
            },
        );


        token::transfer(cpi_ctx, raw_amount)?;


        let data = &mut ctx.accounts.data;

        data.total_tokens = data
            .total_tokens
            .checked_add(ipo_amount)
            .ok_or(ErrorCode::Overflow)?;


        msg!("Deposited {} IPO tokens", ipo_amount);

        Ok(())
    }


    pub fn buy_tokens(
        ctx: Context<BuyTokens>,
        bump: u8,
        token_amount: u64,
    ) -> Result<()> {


        let raw_amount = token_amount
            .checked_mul(TOKEN_DECIMALS)
            .ok_or(ErrorCode::Overflow)?;


        let sol_amount = token_amount
            .checked_mul(LAMPORTS_PER_SOL)
            .ok_or(ErrorCode::Overflow)?;


        let ix = anchor_lang::solana_program::system_instruction::transfer(
            &ctx.accounts.user.key(),
            &ctx.accounts.admin.key(),
            sol_amount,
        );


        anchor_lang::solana_program::program::invoke(
            &ix,
            &[
                ctx.accounts.user.to_account_info(),
                ctx.accounts.admin.to_account_info(),
            ],
        )?;


        msg!("Transferred {} lamports", sol_amount);


        let mint_key = ctx.accounts.ipo_mint.key();

        let seeds = &[
            mint_key.as_ref(),
            &[bump],
        ];


        let signer = &[&seeds[..]];


        let cpi_ctx = CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.ipo_ata_for_ipo_program.to_account_info(),
                to: ctx.accounts.user_ata_for_ipo.to_account_info(),
                authority: ctx.accounts.ipo_ata_for_ipo_program.to_account_info(),
            },
            signer,
        );


        token::transfer(cpi_ctx, raw_amount)?;


        let data = &mut ctx.accounts.data;

        data.total_sold = data
            .total_sold
            .checked_add(token_amount)
            .ok_or(ErrorCode::Overflow)?;


        msg!("Transferred {} IPO tokens", token_amount);


        Ok(())
    }
}


#[derive(Accounts)]
pub struct CreateIpoATA<'info> {

    #[account(
        init,
        payer = admin,
        token::mint = ipo_mint,
        token::authority = ipo_ata_for_ipo_program,
    )]
    pub ipo_ata_for_ipo_program: Account<'info, TokenAccount>,


    #[account(
        init,
        payer = admin,
        space = 8 + 32 + 8 + 8,
        seeds = [b"data", admin.key().as_ref()],
        bump
    )]
    pub data: Account<'info, Data>,


    pub ipo_mint: Account<'info, Mint>,


    #[account(mut)]
    pub ipo_ata_for_admin: Account<'info, TokenAccount>,


    #[account(mut)]
    pub admin: Signer<'info>,


    pub system_program: Program<'info, System>,

    pub token_program: Program<'info, Token>,
}



#[derive(Accounts)]
pub struct DepositIpoATA<'info> {

    #[account(mut)]
    pub ipo_ata_for_ipo_program: Account<'info, TokenAccount>,


    #[account(mut)]
    pub data: Account<'info, Data>,


    #[account(mut)]
    pub ipo_ata_for_admin: Account<'info, TokenAccount>,


    #[account(mut)]
    pub admin: Signer<'info>,


    pub token_program: Program<'info, Token>,
}



#[derive(Accounts)]
#[instruction(bump:u8)]
pub struct BuyTokens<'info> {

    #[account(
        mut,
        seeds=[ipo_mint.key().as_ref()],
        bump=bump
    )]
    pub ipo_ata_for_ipo_program: Account<'info, TokenAccount>,


    #[account(mut)]
    pub data: Account<'info, Data>,


    pub ipo_mint: Account<'info, Mint>,


    #[account(mut)]
    pub user_ata_for_ipo: Account<'info, TokenAccount>,


    #[account(mut)]
    pub user: Signer<'info>,


    #[account(mut)]
    pub admin: SystemAccount<'info>,


    pub token_program: Program<'info, Token>,


    pub system_program: Program<'info, System>,
}



#[account]
pub struct Data {

    pub admin: Pubkey,

    pub total_tokens: u64,

    pub total_sold: u64,
}